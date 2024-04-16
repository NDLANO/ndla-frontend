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
} from "../../graphqlTypes";
import { toTopic } from "../../routeHelpers";
import { TopicPath } from "../../util/getTopicPath";

interface Props {
  topic?: GQLLastLearningpathStepInfo_TopicFragment;
  subject?: GQLLastLearningpathStepInfo_SubjectFragment;
  topicPath?: TopicPath[];
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

  const path =
    !!topicPath && topicPath.length > 1
      ? toTopic(topicPath[0]!.id, ...topicPath.slice(1).map((tp) => tp.id))
      : undefined;

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
        !!topicPath && !!path
          ? {
              url: path,
              name: topicPath[topicPath.length - 1]!.name,
            }
          : undefined
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
};

export default LastLearningpathStepInfo;
