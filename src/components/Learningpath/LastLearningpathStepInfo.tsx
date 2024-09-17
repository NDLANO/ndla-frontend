/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import Resources from "../../containers/Resources/Resources";
import {
  GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment,
  GQLLastLearningpathStepInfo_SubjectFragment,
  GQLLastLearningpathStepInfo_TopicFragment,
} from "../../graphqlTypes";
import { toTopic } from "../../routeHelpers";
import { TopicPath } from "../../util/getTopicPath";

const LinksWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledHGroup = styled("hgroup", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

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
  const { t } = useTranslation();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const linkTopic =
    !!topicPath && topicPath.length > 1
      ? {
          path: toTopic(topicPath[0]!.id, ...topicPath.slice(1).map((tp) => tp.id)),
          name: topicPath[topicPath.length - 1]?.name,
        }
      : undefined;

  return (
    <>
      <StyledHGroup>
        <Heading asChild consumeCss>
          <h2>{t("learningPath.lastStep.heading")}</h2>
        </Heading>
        <Text>{t("learningPath.lastStep.headingSmall", { learningPathName: title })}</Text>
      </StyledHGroup>
      <LinksWrapper>
        {!!subject && (
          <Text>
            {t("learningPath.lastStep.subjectHeading")} <SafeLink to={subject.path}>{subject.name}</SafeLink>
          </Text>
        )}
        {!!linkTopic && (
          <Text>
            {t("learningPath.lastStep.topicHeading")} <SafeLink to={linkTopic.path}>{linkTopic.name}</SafeLink>
          </Text>
        )}
      </LinksWrapper>
      {resourceTypes && (!!topic?.coreResources?.length || !!topic?.supplementaryResources?.length) && (
        <Resources headingType="h2" key="resources" resourceTypes={resourceTypes} topic={topic} subHeadingType="h3" />
      )}
    </>
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
