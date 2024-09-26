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
  GQLLastLearningpathStepInfo_TopicFragment,
  GQLTaxonomyCrumb,
} from "../../graphqlTypes";

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
  topicPath?: GQLTaxonomyCrumb[];
  resourceTypes?: GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment[];
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
}
const LastLearningpathStepInfo = ({ topic, topicPath, resourceTypes, seqNo, numberOfLearningSteps, title }: Props) => {
  const { t } = useTranslation();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const root = topicPath?.[0];
  const parent = topicPath?.toReversed()?.[0];

  return (
    <>
      <StyledHGroup>
        <Heading asChild consumeCss>
          <h2>{t("learningPath.lastStep.heading")}</h2>
        </Heading>
        <Text>{t("learningPath.lastStep.headingSmall", { learningPathName: title })}</Text>
      </StyledHGroup>
      <LinksWrapper>
        {!!root && (
          <Text>
            {t("learningPath.lastStep.subjectHeading")} <SafeLink to={root.path}>{root.name}</SafeLink>
          </Text>
        )}
        {!!parent && (
          <Text>
            {t("learningPath.lastStep.topicHeading")} <SafeLink to={parent.path}>{parent.name}</SafeLink>
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
  resourceType: gql`
    fragment LastLearningpathStepInfo_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default LastLearningpathStepInfo;
