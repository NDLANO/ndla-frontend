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
  GQLLastLearningpathStepInfo_ParentNodeFragment,
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
  parent?: GQLLastLearningpathStepInfo_ParentNodeFragment;
  crumbs?: GQLTaxonomyCrumb[];
  resourceTypes?: GQLLastLearningpathStepInfo_ResourceTypeDefinitionFragment[];
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
  resourceId?: string;
}
const LastLearningpathStepInfo = ({
  parent,
  crumbs,
  resourceTypes,
  seqNo,
  numberOfLearningSteps,
  title,
  resourceId,
}: Props) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep) {
    return null;
  }

  const root = crumbs?.[0];
  const p = crumbs?.toReversed()?.[0];

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
            {t("learningPath.lastStep.subjectHeading")}{" "}
            <SafeLink to={(enablePrettyUrls ? root.url : root.path) ?? ""}>{root.name}</SafeLink>
          </Text>
        )}
        {!!p && (
          <Text>
            {t("learningPath.lastStep.topicHeading")}{" "}
            <SafeLink to={(enablePrettyUrls ? p.url : p.path) ?? ""}>{p.name}</SafeLink>
          </Text>
        )}
      </LinksWrapper>
      {resourceTypes && !!parent?.resources?.length && (
        <Resources
          headingType="h2"
          key="resources"
          resourceTypes={resourceTypes}
          node={parent}
          subHeadingType="h3"
          currentResourceId={resourceId}
        />
      )}
    </>
  );
};

LastLearningpathStepInfo.fragments = {
  parent: gql`
    fragment LastLearningpathStepInfo_ParentNode on Node {
      id
      ...Resources_Parent
    }
    ${Resources.fragments.node}
  `,
  resourceType: gql`
    fragment LastLearningpathStepInfo_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default LastLearningpathStepInfo;
