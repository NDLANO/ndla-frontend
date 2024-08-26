/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { RecipeVariantProps, cva } from "@ndla/styled-system/css";

const navigationSafeLinkButtonRecipe = cva({
  base: {
    justifyContent: "start",
    width: "100%",
  },
  defaultVariants: { variant: "primary" },
  variants: {
    variant: {
      primary: {
        _selected: {
          background: "surface.action.selected",
          color: "text.onAction",
        },
      },
      secondary: {
        background: "surface.actionSubtle",
        _selected: {
          background: "surface.actionSubtle.active",
          color: "text.strong",
        },
      },
    },
  },
});

export type NavigationSafeLinkButtonVariantProps = RecipeVariantProps<typeof navigationSafeLinkButtonRecipe>;

export const NavigationSafeLinkButton = forwardRef<
  HTMLAnchorElement,
  SafeLinkButtonProps & NavigationSafeLinkButtonVariantProps
>((props, ref) => (
  <SafeLinkButton css={navigationSafeLinkButtonRecipe.raw({ variant: props.variant })} {...props} ref={ref} />
));
