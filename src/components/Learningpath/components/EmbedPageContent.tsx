/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

export const EmbedPageContent = styled(PageContent, {
  base: {
    background: "background.default",
    tablet: {
      border: "1px solid",
      borderColor: "stroke.subtle",
      boxShadow: "small",
      borderRadius: "xsmall",
    },
  },
});
