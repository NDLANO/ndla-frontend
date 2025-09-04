/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { transform } from "@ndla/article-converter";
import { ArticleContent, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { EmbedPageContent } from "./EmbedPageContent";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { GQLLearningpath_LearningpathFragment } from "../../../graphqlTypes";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
}

export const LearningpathIntroduction = ({ learningpath }: Props) => {
  return (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        <ArticleTitle id={SKIP_TO_CONTENT_ID} title={learningpath.title} contentType="learning-path" />
        <ArticleContent>
          {!!learningpath.introduction?.length && <section>{transform(learningpath.introduction, {})}</section>}
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  );
};
