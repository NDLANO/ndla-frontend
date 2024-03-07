/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Helmet } from "react-helmet-async";
import { PageContainer } from "@ndla/ui";
import IframePage from "./IframePage";
import { BaseNameProvider } from "../components/BaseNameContext";
import Scripts from "../components/Scripts/Scripts";
import { isValidLocale } from "../i18n";
import { LocaleType } from "../interfaces";

interface Props {
  locale?: LocaleType;
  basename?: string;
  articleId?: string;
  taxonomyId?: string;
  status?: "success" | "error";
  isOembed?: string;
}
const IframePageContainer = ({ basename, status, taxonomyId, articleId, isOembed, locale }: Props) => {
  return (
    <BaseNameProvider value={isValidLocale(basename) ? basename : ""}>
      <PageContainer>
        <Scripts />
        <Helmet htmlAttributes={{ lang: locale === "nb" ? "no" : locale }} />
        <IframePage status={status} taxonomyId={taxonomyId} articleId={articleId} isOembed={isOembed} />
      </PageContainer>
    </BaseNameProvider>
  );
};

export default IframePageContainer;
