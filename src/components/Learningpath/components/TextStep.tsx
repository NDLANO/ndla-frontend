/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { transform } from "@ndla/article-converter";
import { Badge } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleWrapper, ArticleTitle, ArticleContent, ArticleFooter, ArticleByline } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import {
  GQLLearningpath_LearningpathFragment,
  GQLLearningpath_LearningpathStepFragment,
  GQLLearningpathPage_NodeFragment,
  GQLMyNdlaLearningpathStepFragment,
} from "../../../graphqlTypes";
import { InactiveMessageBox } from "../../InactiveMessageBox";

const StyledArticleFooter = styled(ArticleFooter, {
  base: {
    "& > :is(:last-child)": {
      paddingBlockEnd: "xxlarge",
    },
  },
});

interface TextStepProps {
  learningpathStep: GQLLearningpath_LearningpathStepFragment | GQLMyNdlaLearningpathStepFragment;
  skipToContentId?: string;
  learningpath?: GQLLearningpath_LearningpathFragment;
  resource?: GQLLearningpathPage_NodeFragment;
  isInactive?: boolean;
}

export const TextStep = ({ learningpathStep, learningpath, skipToContentId, isInactive }: TextStepProps) => {
  const { t } = useTranslation();
  const fallbackId = useId();

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          title={learningpathStep.title}
          badges={<Badge>{t("contentTypes.external")}</Badge>}
          introduction={learningpathStep.introduction}
        />
        {!!isInactive && <InactiveMessageBox />}
        <ArticleContent>
          {learningpathStep.description ? <section>{transform(learningpathStep.description, {})}</section> : null}
        </ArticleContent>
        <StyledArticleFooter>
          <ArticleByline
            authors={learningpathStep.copyright?.contributors ?? learningpath?.copyright.contributors ?? []}
          />
        </StyledArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
