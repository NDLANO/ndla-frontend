/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { RecipeVariantProps, css, cva } from "@ndla/styled-system/css";

const navigationSafeLinkButtonRecipe = cva({
  base: {
    justifyContent: "start",
    textAlign: "start",
    width: "100%",
  },
  defaultVariants: { variant: "primary" },
  variants: {
    variant: {
      primary: {
        "&[aria-current='true'], &[aria-current='page']": {
          background: "surface.action.selected",
          color: "text.onAction",
        },
      },
      secondary: {
        background: "surface.actionSubtle",
        "&[aria-current='true'], &[aria-current='page']": {
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
>(({ css: cssProp, ...props }, ref) => (
  <SafeLinkButton
    css={css.raw(navigationSafeLinkButtonRecipe.raw({ variant: props.variant }), cssProp)}
    {...props}
    ref={ref}
  />
));
