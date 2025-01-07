/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { SearchContainer } from "./SearchContainer";
import { PageContainer } from "../../components/Layout/PageContainer";

export const SearchPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <title>{t("htmlTitles.searchPage")}</title>
      <SearchContainer />
    </PageContainer>
  );
};
