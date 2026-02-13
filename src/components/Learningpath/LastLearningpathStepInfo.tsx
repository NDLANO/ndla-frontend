/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading, Text } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { useTranslation } from "react-i18next";
import { GQLLearningpathPage_NodeFragment } from "../../graphqlTypes";
import { EmbedPageContent } from "./components/EmbedPageContent";

const StyledEmbedPageContent = styled(EmbedPageContent, {
  base: {
    paddingBlockStart: "xlarge",
    paddingBlockEnd: "xxlarge",
    gap: "medium",
  },
});

interface Props {
  resource?: GQLLearningpathPage_NodeFragment;
  seqNo: number;
  numberOfLearningSteps: number;
  title: string;
}

export const LastLearningpathStepInfo = ({ resource, seqNo, numberOfLearningSteps, title }: Props) => {
  const { t } = useTranslation();
  const isLastStep = seqNo === numberOfLearningSteps;

  if (!isLastStep || !resource?.context) {
    return null;
  }

  const crumbs = resource?.context?.parents ?? [];
  const root = crumbs[0];
  const parent = crumbs[crumbs.length - 1];

  return (
    <StyledEmbedPageContent variant="content">
      <Heading asChild consumeCss textStyle="title.large">
        <h2>{t("learningPath.lastStep.heading")}</h2>
      </Heading>
      <Text>{t("learningPath.lastStep.headingSmall", { learningPathName: title })}</Text>
      {!!root && (
        <Text>
          {`${t("learningPath.lastStep.subjectHeading")} `}
          <SafeLink to={root.url ?? ""}>{root.name}</SafeLink>
        </Text>
      )}
      {!!parent && (
        <Text>
          {`${t("learningPath.lastStep.topicHeading")} `}
          <SafeLink to={parent.url ?? ""}>{parent.name}</SafeLink>
        </Text>
      )}
    </StyledEmbedPageContent>
  );
};
