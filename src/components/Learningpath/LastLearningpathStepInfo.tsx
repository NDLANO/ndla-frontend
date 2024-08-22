/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { SafeLink } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { LayoutItem, OneColumn } from "@ndla/ui";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import Resources from "../../containers/Resources/Resources";
import {
  GQLTaxBase,
  GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment,
  GQLLastLearningpathStepInfo_TopicFragment,
} from "../../graphqlTypes";

const StyledOneColumn = styled(OneColumn)`
  background: ${colors.white};
  margin-top: ${spacing.normal};
`;

const LinksWrapper = styled.div`
  margin-top: ${spacing.normal};
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledHGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

interface Props {
  resourceId?: string;
  topic?: GQLLastLearningpathStepInfo_TopicFragment;
  topicPath?: GQLTaxBase[];
  resourceTypes?: GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment[];
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
}
const LastLearningpathStepInfo = ({
  resourceId,
  topic,
  topicPath,
  resourceTypes,
  seqNo,
  numberOfLearningSteps,
  title,
}: Props) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const root = topicPath?.[0];
  const parent = topicPath?.toReversed()?.[0];

  return (
    <StyledOneColumn>
      <LayoutItem layout="center">
        <StyledHGroup>
          <Heading element="h2" headingStyle="h2" margin="none">
            {t("learningPath.lastStep.heading")}
          </Heading>
          <Text margin="none" textStyle="label-small">
            {t("learningPath.lastStep.headingSmall", { learningPathName: title })}
          </Text>
        </StyledHGroup>
        <LinksWrapper>
          {!!root && (
            <Text textStyle="meta-text-medium" margin="none">
              {t("learningPath.lastStep.subjectHeading")}{" "}
              <SafeLink to={enablePrettyUrls ? root.url : root.path}>{root.name}</SafeLink>
            </Text>
          )}
          {!!parent && (
            <Text textStyle="meta-text-medium" margin="none">
              {t("learningPath.lastStep.topicHeading")}{" "}
              <SafeLink to={enablePrettyUrls ? parent.url ?? parent.path : parent.path}>{parent.name}</SafeLink>
            </Text>
          )}
        </LinksWrapper>
        <Resources
          headingType="h2"
          key="resources"
          topicId={parent?.id}
          subjectId={root?.id}
          resourceId={resourceId}
          resourceTypes={resourceTypes}
          topic={topic}
          subHeadingType="h3"
        />
      </LayoutItem>
    </StyledOneColumn>
  );
};

LastLearningpathStepInfo.fragments = {
  topic: gql`
    fragment LastLearningpathStepInfo_Topic on Node {
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
