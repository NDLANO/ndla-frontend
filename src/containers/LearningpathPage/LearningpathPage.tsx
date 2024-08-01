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
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import Learningpath from "../../components/Learningpath";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLTaxBase,
  GQLLearningpath,
  GQLLearningpathPage_ResourceFragment,
  GQLLearningpathPage_ResourceTypeDefinitionFragment,
  GQLLearningpathPage_SubjectFragment,
  GQLLearningpathPage_TopicFragment,
  GQLLearningpathStep,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

interface PropData {
  relevance: string;
  topic?: GQLLearningpathPage_TopicFragment;
  topicPath: GQLTaxBase[];
  subject?: GQLLearningpathPage_SubjectFragment;
  resourceTypes?: GQLLearningpathPage_ResourceTypeDefinitionFragment[];
  resource?: GQLLearningpathPage_ResourceFragment;
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
    !data.topicPath ||
    (data?.resource?.learningpath?.learningsteps?.length ?? 0) === 0
  ) {
    return <DefaultErrorMessage />;
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
    ? toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...topicPath, resource])
    : toBreadcrumbItems(t("breadcrumb.toFrontpage"), [resource]);

  return (
    <div>
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
        path={resource.path}
        resourceTypes={resourceTypes}
        topicPath={topicPath}
        breadcrumbItems={breadcrumbItems}
      />
    </div>
  );
};

const getTitle = (
  subject?: Pick<GQLLearningpathPage_SubjectFragment, "name" | "subjectpage">,
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

export const learningpathFragment = gql`
  fragment LearningpathPage_Learningpath on Learningpath {
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
  ${Learningpath.fragments.learningpathStep}
  ${Learningpath.fragments.learningpath}
`;

export const learningpathPageFragments = {
  topic: gql`
    fragment LearningpathPage_Topic on Node {
      ...Learningpath_Topic
    }
    ${Learningpath.fragments.topic}
  `,
  subject: gql`
    fragment LearningpathPage_Subject on Node {
      id
      metadata {
        customFields
      }
      subjectpage {
        id
        about {
          title
        }
      }
      ...Learningpath_Subject
    }
    ${Learningpath.fragments.subject}
  `,
  resourceType: gql`
    fragment LearningpathPage_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Learningpath_ResourceTypeDefinition
    }
    ${Learningpath.fragments.resourceType}
  `,
  resource: gql`
    fragment LearningpathPage_Resource on Node {
      id
      name
      path
      url
      learningpath {
        ...LearningpathPage_Learningpath
      }
    }
    ${learningpathFragment}
  `,
};

export default LearningpathPage;
