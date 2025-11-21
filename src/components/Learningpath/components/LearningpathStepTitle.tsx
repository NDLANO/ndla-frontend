/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { transform } from "@ndla/article-converter";
import { getLicenseByAbbreviation } from "@ndla/licenses";
import { Heading } from "@ndla/primitives";
import { ArticleWrapper, ArticleContent, ArticleHeader, LicenseLink } from "@ndla/ui";
import { BaseStepProps } from "../learningpathTypes";
import { EmbedPageContent } from "./EmbedPageContent";

export const LearningpathStepTitle = ({ learningpathStep, skipToContentId }: BaseStepProps) => {
  const { i18n } = useTranslation();
  return learningpathStep.showTitle || learningpathStep.description ? (
    <EmbedPageContent variant="content">
      <ArticleWrapper>
        {!!learningpathStep.showTitle && (
          <ArticleHeader>
            <Heading id={learningpathStep.showTitle ? skipToContentId : undefined}>{learningpathStep.title}</Heading>
            <LicenseLink
              license={getLicenseByAbbreviation(learningpathStep.copyright?.license?.license ?? "", i18n.language)}
            />
          </ArticleHeader>
        )}
        <ArticleContent>
          {!!learningpathStep.description && <section>{transform(learningpathStep.description, {})}</section>}
        </ArticleContent>
      </ArticleWrapper>
    </EmbedPageContent>
  ) : null;
};
