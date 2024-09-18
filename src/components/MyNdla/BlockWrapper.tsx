/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const BlockWrapper = styled("ul", {
  base: {
    display: "grid",
    height: "100%",
    width: "100%",
  },
  variants: {
    variant: {
      list: {},
      listLarger: {},
      block: {
        gap: "medium",
        gridTemplateColumns: "repeat(1, 1fr)",
        tabletWide: {
          gridTemplateColumns: "repeat(2, 1fr)",
        },
        wide: {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
      },
    },
  },
});
