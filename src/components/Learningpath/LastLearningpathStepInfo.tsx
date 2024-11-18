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
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import Resources from "../../containers/Resources/Resources";
import {
  GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment,
  GQLLearningpathPage_NodeFragment,
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
  resource?: GQLLearningpathPage_NodeFragment;
  resourceTypes?: GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment[];
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
}
const LastLearningpathStepInfo = ({ resource, seqNo, numberOfLearningSteps, title }: Props) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const crumbs = resource?.context?.parents ?? [];
  const root = crumbs[0];
  const parent = crumbs[crumbs.length - 1];

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
            {`${t("learningPath.lastStep.subjectHeading")} `}
            <SafeLink to={(enablePrettyUrls ? root.url : root.path) ?? ""}>{root.name}</SafeLink>
          </Text>
        )}
        {!!parent && (
          <Text>
            {`${t("learningPath.lastStep.topicHeading")} `}
            <SafeLink to={(enablePrettyUrls ? parent.url : parent.path) ?? ""}>{parent.name}</SafeLink>
          </Text>
        )}
      </LinksWrapper>
      {!!parent && (
        <Resources
          headingType="h2"
          key="resources"
          parentId={parent.id}
          rootId={root?.id}
          subHeadingType="h3"
          currentResourceId={resource?.id}
        />
      )}
    </>
  );
};

LastLearningpathStepInfo.fragments = {
  resourceType: gql`
    fragment LastLearningpathStepInfo_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default LastLearningpathStepInfo;
