/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { GQLStructuredArticleDataFragment } from "../graphqlTypes";
import { Breadcrumb } from "../interfaces";
import getStructuredDataFromArticle from "../util/getStructuredDataFromArticle";

interface Props {
  article: GQLStructuredArticleDataFragment;
  breadcrumbItems?: Breadcrumb[];
}

export const LdJson = ({ article, breadcrumbItems }: Props) => {
  const { i18n } = useTranslation();
  return (
    <script type="application/ld+json">
      {JSON.stringify(getStructuredDataFromArticle(article, i18n.language, breadcrumbItems))}
    </script>
  );
};
