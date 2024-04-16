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
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { useTracker } from "@ndla/tracker";
import { constants } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import Learningpath from "../../components/Learningpath";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLLearningpath,
  GQLLearningpathPage_ResourceFragment,
  GQLLearningpathPage_ResourceTypeDefinitionFragment,
  GQLLearningpathPage_SubjectFragment,
  GQLLearningpathPage_TopicFragment,
  GQLLearningpathStep,
} from "../../graphqlTypes";
import { toBreadcrumbItems, toLearningPath } from "../../routeHelpers";
import { TopicPath } from "../../util/getTopicPath";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";

interface PropData {
  relevance: string;
  topic?: GQLLearningpathPage_TopicFragment;
  topicPath: TopicPath[];
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
  const navigate = useNavigate();
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

  const onKeyUpEvent = (evt: KeyboardEvent) => {
    const steps = data?.resource?.learningpath?.learningsteps;
    const learningpathStep = stepId ? steps?.find((step) => step.id.toString() === stepId.toString()) : steps?.[0];
    if (evt.code === "ArrowRight" || evt.code === "ArrowLeft") {
      const directionValue = evt.code === "ArrowRight" ? 1 : -1;
      const newSeqNo = (learningpathStep?.seqNo ?? 0) + directionValue;
      const newLearningpathStep = steps?.find((step) => step.seqNo === newSeqNo);
      if (newLearningpathStep) {
        const res = resource.path ? { path: resource.path, id: resource.id } : undefined;
        navigate(toLearningPath(data.resource!.learningpath!.id.toString(), newLearningpathStep.id.toString(), res));
      }
    }
  };

  if (
    !data.resource ||
    !data.resource.learningpath ||
    !data.topic ||
    !data.topicPath ||
    !data.subject ||
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

  const breadcrumbItems =
    subject && topicPath
      ? toBreadcrumbItems(t("breadcrumb.toFrontpage"), [
          ...topicPath,
          { name: learningpath.title, id: `${learningpath.id}` },
        ])
      : toBreadcrumbItems(t("breadcrumb.toFrontpage"), [{ name: learningpath.title, id: `${learningpath.id}` }]);

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
        onKeyUpEvent={onKeyUpEvent}
        resource={resource}
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

export const learningpathPageFragments = {
  topic: gql`
    fragment LearningpathPage_Topic on Topic {
      ...Learningpath_Topic
    }
    ${Learningpath.fragments.topic}
  `,
  subject: gql`
    fragment LearningpathPage_Subject on Subject {
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
    fragment LearningpathPage_Resource on Resource {
      id
      ...Learningpath_Resource
      learningpath {
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
    ${Learningpath.fragments.resource}
  `,
};

export default LearningpathPage;
