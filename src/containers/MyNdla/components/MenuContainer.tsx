/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ark } from "@ark-ui/react";
import { styled } from "@ndla/styled-system/jsx";

export const MenuContainer = styled(
  ark.div,
  {
    base: {
      background: "surface.default",
      boxShadow: "xsmall",
      borderRadius: "xsmall",
      padding: "xxsmall",
      height: "fit-content",
    },
  },
  { baseComponent: true },
);

export const MenuList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
    width: "100%",
  },
});
