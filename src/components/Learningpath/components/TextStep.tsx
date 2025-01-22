/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { transform } from "@ndla/article-converter";
import { ArticleWrapper, ArticleTitle, ArticleContent, ArticleFooter, ArticleByline } from "@ndla/ui";
import { BaseStepProps, EmbedPageContent } from "./LearningpathStep";
import { GQLLearningpath_LearningpathFragment } from "../../../graphqlTypes";

interface TextStepProps extends BaseStepProps {
  learningpath: GQLLearningpath_LearningpathFragment;
}

export const TextStep = ({ learningpathStep, learningpath, skipToContentId }: TextStepProps) => {
  const fallbackId = useId();

  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          title={learningpathStep.title}
          contentType="external"
          introduction={learningpathStep.introduction}
        />
        <ArticleContent>
          {learningpathStep.description ? <section>{transform(learningpathStep.description, {})}</section> : null}
        </ArticleContent>
        <ArticleFooter>
          <ArticleByline authors={learningpath.copyright.contributors} />
        </ArticleFooter>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
