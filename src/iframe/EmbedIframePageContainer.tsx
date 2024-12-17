/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import EmbedIframePage from "./EmbedIframePage";
import { BaseNameProvider } from "../components/BaseNameContext";
import { PageLayout } from "../components/Layout/PageContainer";
import { isValidLocale } from "../i18n";
import { LocaleType } from "../interfaces";

interface Props {
  basename?: string;
  embedType?: string;
  embedId?: string;
  locale?: LocaleType;
}
const EmbedIframePageContainer = ({ basename, embedType, embedId }: Props) => {
  return (
    <BaseNameProvider value={isValidLocale(basename) ? basename : ""}>
      <PageLayout>
        <EmbedIframePage embedId={embedId} embedType={embedType} />
      </PageLayout>
    </BaseNameProvider>
  );
};

export default EmbedIframePageContainer;
