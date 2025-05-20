/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Presence } from "@ark-ui/react";
import { PopoverContentStandalone } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

export const MastheadPopoverContent = styled(PopoverContentStandalone, {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxWidth: "surface.wideMax",
    maxHeight: "100vh",
    overflow: "auto",
    position: "absolute",
    left: "0",
    right: "0",
    marginInline: "auto",
    top: "var(--masthead-height)",
    padding: "0",
    borderRadius: "0",
    tabletWide: {
      flexDirection: "row",
    },
    "& > *": {
      paddingBlockStart: "medium",
      paddingInline: "xxlarge",
      paddingBlockEnd: "xxlarge",
    },
  },
});

export const MastheadPopoverBackdrop = styled(
  Presence,
  {
    base: {
      position: "absolute",
      top: "var(--masthead-height)",
      overflow: "hidden",
      left: "0",
      zIndex: "-1",
      width: "100%",
      height: "100vh",
      background: "rgba(1, 1, 1, 0.3)",
      _open: {
        animation: "backdrop-in",
        _motionReduce: {
          animation: "none",
        },
      },
      _closed: {
        animation: "backdrop-out",
        _motionReduce: {
          animation: "none",
        },
      },
    },
  },
  { baseComponent: true },
);
