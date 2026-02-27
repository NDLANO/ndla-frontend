/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { PageContainer, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

export const RootPageContent = styled(PageContainer, {
  base: {
    rowGap: "xxlarge",
    desktopDown: {
      paddingBlockStart: "medium",
      rowGap: "medium",
    },
  },
});

export const LayoutWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    transitionProperty: "gap",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    desktop: {
      gap: "xlarge",
    },
    wide: {
      gap: "3xlarge",
    },
  },
});

export const ResourceContentContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xlarge",
    width: "100%",
    flex: "1",
  },
});

export const ResourceContent = styled(PageContent, {
  base: {
    background: "background.default",
    desktop: {
      boxShadow: "xsmall",
    },
  },
});
