/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const MyNdlaPageSection = styled("div", {
  base: {
    display: "flex",
    maxWidth: "surface.pageMax",
    flexDirection: "column",
    gap: "medium",
  },
});

export const MyNdlaPageContent = styled(MyNdlaPageSection, {
  base: {
    maxWidth: "surface.contentMax",
  },
});
