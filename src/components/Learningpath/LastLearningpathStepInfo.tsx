/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { LearningPathLastStepNavigation } from "@ndla/ui";
import Resources from "../../containers/Resources/Resources";
import {
  GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment,
  GQLLastLearningpathStepInfo_SubjectFragment,
  GQLLastLearningpathStepInfo_TopicFragment,
  GQLLastLearningpathStepInfo_TopicPathFragment,
} from "../../graphqlTypes";

interface Props {
  topic?: GQLLastLearningpathStepInfo_TopicFragment;
  subject?: GQLLastLearningpathStepInfo_SubjectFragment;
  topicPath?: GQLLastLearningpathStepInfo_TopicPathFragment[];
  resourceTypes?: GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment[];
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
}
const LastLearningpathStepInfo = ({
  topic,
  subject,
  topicPath,
  resourceTypes,
  seqNo,
  numberOfLearningSteps,
  title,
}: Props) => {
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }
  const topicWithPath = topicPath && topic ? topicPath.find((path) => path.id === topic.id) : undefined;

  const showResources =
    topic &&
    resourceTypes &&
    ((topic.coreResources && topic.coreResources.length > 0) ||
      (topic.supplementaryResources && topic.supplementaryResources.length > 0));

  return (
    <LearningPathLastStepNavigation
      learningPathName={title}
      subject={
        subject && {
          url: subject.path,
          name: subject.name,
        }
      }
      topic={
        topicWithPath && {
          url: topicWithPath.path,
          name: topicWithPath.name,
        }
      }
    >
      {showResources && topic && (
        <Resources headingType="h2" key="resources" resourceTypes={resourceTypes} topic={topic} subHeadingType="h3" />
      )}
    </LearningPathLastStepNavigation>
  );
};

LastLearningpathStepInfo.fragments = {
  topic: gql`
    fragment LastLearningpathStepInfo_Topic on Topic {
      id
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
  subject: gql`
    fragment LastLearningpathStepInfo_Subject on Subject {
      path
      name
    }
  `,
  resourceType: gql`
    fragment LastLearningpathStepInfo_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
  topicPath: gql`
    fragment LastLearningpathStepInfo_TopicPath on Topic {
      id
      name
      path
    }
  `,
};

export default LastLearningpathStepInfo;
