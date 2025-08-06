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
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "medium",
    "&:has(> :only-child)": {
      gridTemplateColumns: "1fr",
    },
    "&:has(> :last-child:nth-child(2))": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    tabletWideDown: {
      gridTemplateColumns: "1fr",
      "&:has(> :last-child:nth-child(2))": {
        gridTemplateColumns: "repeat(1, 1fr)",
      },
    },
  },
});
