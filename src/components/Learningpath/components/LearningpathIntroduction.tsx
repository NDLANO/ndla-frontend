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
import { useId } from "react";
import { useTranslation } from "react-i18next";
import { InactiveMessageBox } from "../../InactiveMessageBox";
import { ResourceContent } from "../../Resource/ResourceLayout";

interface Props {
  introduction?: string;
  isInactive?: boolean;
  skipToContentId?: string;
}

export const LearningpathIntroduction = ({ introduction, isInactive, skipToContentId }: Props) => {
  const { t } = useTranslation();
  const fallbackId = useId();
  return (
    <ResourceContent variant="content">
      <ArticleWrapper>
        <ArticleTitle
          id={skipToContentId ?? fallbackId}
          title={t("learningpathPage.introduction")}
          badges={<Badge>{t("contentTypes.learning-path")}</Badge>}
        />
        {!!isInactive && <InactiveMessageBox />}
        <ArticleContent>{!!introduction?.length && <section>{transform(introduction, {})}</section>}</ArticleContent>
      </ArticleWrapper>
    </ResourceContent>
  );
};
