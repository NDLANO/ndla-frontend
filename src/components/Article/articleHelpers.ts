/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { webpageReferenceApa7CopyString } from "@ndla/licenses";
import { useTranslation } from "react-i18next";
import { useHref, useLocation } from "react-router";
import config from "../../config";
import { GQLArticle } from "../../graphqlTypes";

export const useArticleCopyText = (
  article: Pick<GQLArticle, "id" | "title" | "published" | "copyright"> | undefined,
) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const href = useHref(location);
  if (!article) return undefined;
  const [day, month, year] = article.published.split(".").map((s) => parseInt(s));
  const published = new Date(year!, month! - 1, day!).toUTCString();
  return webpageReferenceApa7CopyString(
    article.title,
    undefined,
    published,
    `${config.ndlaFrontendDomain}${href}`,
    article.copyright,
    i18n.language,
    "",
    (id: string) => t(id),
  );
};
