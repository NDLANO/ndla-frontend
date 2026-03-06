/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { transform } from "@ndla/article-converter";
import { Badge } from "@ndla/primitives";
import { ArticleContent, ArticleTitle, ArticleWrapper } from "@ndla/ui";
import { useTranslation } from "react-i18next";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { GQLLearningpath_LearningpathFragment } from "../../../graphqlTypes";
import { InactiveMessageBox } from "../../InactiveMessageBox";
import { ResourceContent } from "../../Resource/ResourceLayout";

interface Props {
  learningpath: GQLLearningpath_LearningpathFragment;
  isInactive?: boolean;
}

export const LearningpathIntroduction = ({ learningpath, isInactive }: Props) => {
  const { t } = useTranslation();
  return (
    <ResourceContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={SKIP_TO_CONTENT_ID}
          title={t("learningpathPage.introduction")}
          badges={<Badge>{t("contentTypes.learning-path")}</Badge>}
        />
        {!!isInactive && <InactiveMessageBox />}
        <ArticleContent>
          {!!learningpath.introduction?.length && <section>{transform(learningpath.introduction, {})}</section>}
        </ArticleContent>
      </ArticleWrapper>
    </ResourceContent>
  );
};
