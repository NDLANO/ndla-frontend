/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ark } from "@ark-ui/react";
import { SafeLink } from "@ndla/safelink";
import { sva } from "@ndla/styled-system/css";
import { createStyleContext, styled } from "@ndla/styled-system/jsx";

const stepperRecipe = sva({
  slots: ["root", "track", "link", "list", "listItem", "indicator"],
  base: {
    root: {
      position: "relative",
      width: "inherit",
    },
    indicator: {
      display: "inline-flex",
      alignItems: "center",
      userSelect: "none",
      justifyContent: "center",
      borderRadius: "full",
      width: "medium",
      height: "medium",
      border: "1px solid",
      borderColor: "stroke.default",
      flexShrink: "0",
      zIndex: "2",
      transitionProperty: "background",
      transitionDuration: "fast",
      transitionTimingFunction: "default",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "large",
      position: "relative",
      zIndex: "base",
    },
    link: {
      textStyle: "body.medium",
      textDecoration: "underline",
      zIndex: "3",
      _hover: {
        textDecoration: "none",
      },
    },
    listItem: {
      position: "relative",
      color: "text.strong",
      display: "flex",
      gap: "xxsmall",
      justifyContent: "flex-start",
      alignItems: "flex-start",
      minHeight: "xxlarge",
      background: "background.default",
      _hover: {
        "& [data-indicator]": {
          backgroundColor: "surface.action.brand.1.hover",
        },
      },
      _active: {
        "& [data-indicator]": {
          backgroundColor: "surface.action.brand.1.active",
        },
      },
      "&:has([aria-current='page']), &[data-current]": {
        "& [data-indicator]": {
          backgroundColor: "surface.action.brand.1.hover.strong",
        },
      },
    },
  },
  variants: {
    collapsed: {
      true: {
        root: {
          pointerEvents: "none",
        },
        list: {
          alignItems: "center",
        },
      },
      false: {},
    },
    line: {
      true: {
        list: {
          _before: {
            content: '""',
            zIndex: "1",
            position: "absolute",
            height: "100%",
            top: "0",
            left: "xsmall",
            width: "1px",
            background: "stroke.default",
          },
        },
        listItem: {
          _before: {
            content: '""',
            position: "absolute",
            left: "0",
            top: "-xxsmall",
            height: "calc(token(spacing.medium) + token(spacing.small))",
            width: "medium",
            backgroundColor: "inherit",
            zIndex: "1",
          },
          _last: {
            _before: {
              height: "calc(100% + token(spacing.small))",
            },
          },
        },
      },
      false: {},
    },
  },
});

const { withContext, withProvider } = createStyleContext(stepperRecipe);

export const StepperRoot = withProvider(ark.nav, "root", { baseComponent: true });
export const StepperTrack = withContext(ark.div, "track", { baseComponent: true });
export const StepperList = withContext(ark.ol, "list", { baseComponent: true });
const BaseStepperListItem = withContext(ark.li, "listItem", { baseComponent: true });
export const StepperIndicator = withContext(ark.div, "indicator", {
  baseComponent: true,
  defaultProps: { "data-indicator": "", "aria-hidden": true },
});
export const StepperSafeLink = withContext(SafeLink, "link", { baseComponent: true });

export const StepperListItem = styled(BaseStepperListItem, {
  variants: {
    completed: {
      true: {
        "& [data-indicator]": {
          backgroundColor: "surface.brand.3.moderate",
        },
        _hover: {
          "& [data-indicator]": {
            backgroundColor: "surface.action.brand.1.hover",
          },
        },
        _active: {
          "& [data-indicator]": {
            backgroundColor: "surface.action.brand.1.active",
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    completed: false,
  },
});
