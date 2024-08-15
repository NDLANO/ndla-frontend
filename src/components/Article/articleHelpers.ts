/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { webpageReferenceApa7CopyString } from "@ndla/licenses";
import config from "../../config";
import { GQLArticle } from "../../graphqlTypes";

export const useArticleCopyText = (article: Pick<GQLArticle, "id" | "title" | "published" | "copyright">) => {
  const { t, i18n } = useTranslation();
  const [day, month, year] = article.published.split(".").map((s) => parseInt(s));
  const published = new Date(year!, month! - 1, day!).toUTCString();
  return webpageReferenceApa7CopyString(
    article.title,
    undefined,
    published,
    `${config.ndlaFrontendDomain}/article/${article.id}`,
    article.copyright,
    i18n.language,
    "",
    (id: string) => t(id),
  );
};
