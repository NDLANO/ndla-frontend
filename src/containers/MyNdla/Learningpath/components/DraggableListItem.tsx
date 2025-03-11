/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const DraggableListItem = styled("li", {
  base: {
    display: "flex",
    position: "relative",
    listStyle: "none",
    alignItems: "center",
    gap: "xxsmall",
  },
  variants: {
    isDragging: {
      true: {
        zIndex: "docked",
      },
    },
  },
});
