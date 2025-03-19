/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import IframePage from "./IframePage";
import { AlertsProvider } from "../components/AlertsContext";
import { BaseNameProvider } from "../components/BaseNameContext";
import { PageLayout } from "../components/Layout/PageContainer";
import Scripts from "../components/Scripts/Scripts";
import { isValidLocale } from "../i18n";

interface Props {
  basename?: string;
  articleId?: string;
  taxonomyId?: string;
  status?: "success" | "error";
  isOembed?: string;
}
const IframePageContainer = ({ basename, status, taxonomyId, articleId, isOembed }: Props) => {
  return (
    <BaseNameProvider value={isValidLocale(basename) ? basename : ""}>
      <AlertsProvider>
        <PageLayout>
          <Scripts />
          <IframePage status={status} taxonomyId={taxonomyId} articleId={articleId} isOembed={isOembed} />
        </PageLayout>
      </AlertsProvider>
    </BaseNameProvider>
  );
};

export default IframePageContainer;
