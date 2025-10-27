/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EmbedIframePage } from "./EmbedIframePage";
import { PageLayout } from "../components/Layout/PageContainer";

export const EmbedIframePageContainer = () => {
  return (
    <PageLayout>
      <EmbedIframePage />
    </PageLayout>
  );
};

export const Component = EmbedIframePageContainer;
