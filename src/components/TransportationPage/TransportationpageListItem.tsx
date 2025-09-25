/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { styled } from "@ndla/styled-system/jsx";

export const TransportationPageListItem = styled("li", {
  base: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
    gap: "3xsmall",
    padding: "medium",
    _after: {
      content: '""',
      bottom: "0",
      position: "absolute",
      width: "100%",
      background: "stroke.subtle",
      height: "1px",
      left: "0",
      transitionProperty: "height, background",
      transitionTimingFunction: "ease-in-out",
      transitionDuration: "superFast",
    },
    _hover: {
      _after: {
        height: "4xsmall",
        background: "stroke.hover",
      },
    },
    _active: {
      background: "surface.active",
    },
  },
});
