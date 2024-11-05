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
import { constants } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import Learningpath from "../../components/Learningpath";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLLearningpath,
  GQLLearningpathPage_NodeFragment,
  GQLLearningpathPage_ResourceTypeDefinitionFragment,
  GQLLearningpathPage_RootFragment,
  GQLLearningpathPage_ParentFragment,
  GQLLearningpathStep,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

interface PropData {
  relevance: string;
  topic?: GQLLearningpathPage_ParentFragment;
  topicPath: GQLTaxonomyCrumb[];
  subject?: GQLLearningpathPage_RootFragment;
  resourceTypes?: GQLLearningpathPage_ResourceTypeDefinitionFragment[];
  resource?: GQLLearningpathPage_NodeFragment;
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
    const { resource, subject } = data;
    const learningpath = resource?.learningpath;
    const firstStep = learningpath?.learningsteps?.[0];
    const currentStep = learningpath?.learningsteps?.find((ls) => `${ls.id}` === stepId);
    const learningstep = currentStep || firstStep;
    const dimensions = getAllDimensions({
      learningpath,
      learningstep,
      filter: subject?.name,
      user,
    });
    trackPageView({ dimensions, title: getDocumentTitle(t, data, stepId) });
  }, [authContextLoaded, data, loading, stepId, t, trackPageView, user]);

  if (
    !data.resource ||
    !data.resource.learningpath ||
    !data.topic ||
    !data.topicPath ||
    !data.subject ||
    (data?.resource?.learningpath?.learningsteps?.length ?? 0) === 0
  ) {
    return <DefaultErrorMessagePage />;
  }
  const { resource, topic, resourceTypes, subject, topicPath } = data;
  const learningpath = resource.learningpath!;

  const learningpathStep = stepId
    ? learningpath.learningsteps?.find((step) => step.id.toString() === stepId.toString())
    : learningpath.learningsteps?.[0];

  if (!learningpathStep) {
    return null;
  }

  const breadcrumbItems = topicPath
    ? toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...topicPath, resource], enablePrettyUrls)
    : toBreadcrumbItems(t("breadcrumb.toFrontpage"), [resource], enablePrettyUrls);

  return (
    <>
      <Helmet>
        <title>{`${getDocumentTitle(t, data, stepId)}`}</title>
        {subject?.metadata.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.ARCHIVE_SUBJECTS && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(getTitle(subject, learningpath, learningpathStep), [t("htmlTitles.titleTemplate")])}
        trackableContent={learningpath}
        description={learningpath.description}
        imageUrl={learningpath.coverphoto?.url}
      />
      <Learningpath
        skipToContentId={skipToContentId}
        learningpath={learningpath}
        learningpathStep={learningpathStep}
        topic={topic}
        subject={subject}
        resourcePath={enablePrettyUrls ? resource.url : resource.path}
        resourceTypes={resourceTypes}
        topicPath={topicPath}
        breadcrumbItems={breadcrumbItems}
      />
    </>
  );
};

const getTitle = (
  subject?: Pick<GQLLearningpathPage_RootFragment, "name" | "subjectpage">,
  learningpath?: Pick<GQLLearningpath, "title">,
  learningpathStep?: Pick<GQLLearningpathStep, "title">,
) => {
  return htmlTitle(learningpath?.title, [learningpathStep?.title, subject?.name]);
};

const getDocumentTitle = (t: TFunction, data: PropData, stepId?: string) => {
  const subject = data.subject;
  const learningpath = data.resource?.learningpath;
  const maybeStepId = parseInt(stepId ?? "");
  const step = learningpath?.learningsteps.find((step) => step.id === maybeStepId);
  return htmlTitle(getTitle(subject, learningpath, step), [t("htmlTitles.titleTemplate")]);
};

export const learningpathPageFragments = {
  parent: gql`
    fragment LearningpathPage_Parent on Node {
      ...Learningpath_Parent
    }
    ${Learningpath.fragments.parent}
  `,
  root: gql`
    fragment LearningpathPage_Root on Node {
      id
      name
      path
      url
      metadata {
        customFields
      }
      subjectpage {
        id
        about {
          title
        }
      }
      ...Learningpath_Node
    }
    ${Learningpath.fragments.root}
  `,
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
