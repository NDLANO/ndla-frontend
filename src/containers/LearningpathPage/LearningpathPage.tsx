/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TFunction } from "i18next";
import { useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useTracker } from "@ndla/tracker";
import { AuthContext } from "../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import Learningpath from "../../components/Learningpath";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import {
  GQLLearningpath,
  GQLLearningpathPage_NodeFragment,
  GQLLearningpathStep,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

interface PropData {
  relevance: string;
  node?: GQLLearningpathPage_NodeFragment;
}

interface Props {
  loading: boolean;
  data: PropData;
  skipToContentId: string;
  stepId?: string;
}

const LearningpathPage = ({ data, skipToContentId, stepId, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { trackPageView } = useTracker();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (loading || !data || !authContextLoaded) return;
    const { node } = data;
    const learningpath = node?.learningpath;
    const firstStep = learningpath?.learningsteps?.[0];
    const currentStep = learningpath?.learningsteps?.find((ls) => `${ls.id}` === stepId);
    const learningstep = currentStep || firstStep;
    const dimensions = getAllDimensions({
      learningpath,
      learningstep,
      filter: node?.context?.parents?.[0]?.name,
      user,
    });
    trackPageView({ dimensions, title: getDocumentTitle(t, data, stepId) });
  }, [authContextLoaded, data, loading, stepId, t, trackPageView, user]);

  if (!data.node || !data.node.learningpath || (data?.node?.learningpath?.learningsteps?.length ?? 0) === 0) {
    return <DefaultErrorMessagePage />;
  }
  const { node } = data;
  const crumbs = node.context?.parents ?? [];
  const root = crumbs[0];
  const learningpath = node.learningpath!;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath.learningsteps?.[0];

  if (!learningpathStep) {
    return null;
  }

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, node], enablePrettyUrls);

  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle(t, data, stepId)}`}</title>
        {!node.context?.isActive && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(getTitle(root, learningpath, learningpathStep), [t("htmlTitles.titleTemplate")])}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.url}
      />
      <Learningpath
        skipToContentId={skipToContentId}
        learningpath={learningpath}
        learningpathStep={learningpathStep}
        resource={node}
        resourcePath={enablePrettyUrls ? node.url : node.path}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
};

const getTitle = (
  root?: Pick<GQLTaxonomyCrumb, "name">,
  learningpath?: Pick<GQLLearningpath, "title">,
  learningpathStep?: Pick<GQLLearningpathStep, "title">,
) => {
  return htmlTitle(learningpath?.title, [learningpathStep?.title, root?.name]);
};

const getDocumentTitle = (t: TFunction, data: PropData, stepId?: string) => {
  const subject = data.node?.context?.parents?.[0];
  const learningpath = data.node?.learningpath;
  const maybeStepId = parseInt(stepId ?? "");
  const step = learningpath?.learningsteps.find((step) => step.id === maybeStepId);
  return htmlTitle(getTitle(subject, learningpath, step), [t("htmlTitles.titleTemplate")]);
};

LearningpathPage.fragments = {
  resourceType: gql`
    fragment LearningpathPage_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Learningpath_ResourceTypeDefinition
    }
    ${Learningpath.fragments.resourceType}
  `,
  resource: gql`
    fragment LearningpathPage_Node on Node {
      id
      name
      path
      url
      context {
        contextId
        isActive
        parents {
          contextId
          id
          name
          path
          url
        }
      }
      learningpath {
        id
        supportedLanguages
        tags
        description
        coverphoto {
          url
          metaUrl
        }
        learningsteps {
          type
          ...Learningpath_LearningpathStep
        }
        ...Learningpath_Learningpath
      }
    }
    ${Learningpath.fragments.learningpathStep}
    ${Learningpath.fragments.learningpath}
  `,
};

export default LearningpathPage;
