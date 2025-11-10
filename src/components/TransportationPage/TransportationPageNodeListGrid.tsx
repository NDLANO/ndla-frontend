/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const TransportationPageNodeListGrid = styled("ol", {
  base: {
    listStyle: "none",
    display: "grid",
    gap: "medium",
    desktopDown: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    tabletDown: {
      gridTemplateColumns: "1fr",
    },
  },
  defaultVariants: {
    context: "node",
  },
  variants: {
    context: {
      case: {
        gridTemplateColumns: "repeat(4, 1fr)",
      },
      node: {
        gridTemplateColumns: "repeat(3, 1fr)",
      },
    },
  },
});
