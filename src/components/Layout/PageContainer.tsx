/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { HTMLArkProps, ark } from "@ark-ui/react";
import { PageContent, PageContentVariantProps } from "@ndla/primitives";
import { css, cva } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps, RecipeVariantProps } from "@ndla/styled-system/types";

export const PageLayout = styled(
  ark.div,
  {
    base: {
      // TODO: Update this value to accurately reflect the masthead height.
      minHeight: "calc(100vh - 56px)",
    },
  },
  { baseComponent: true },
);

export const ErrorLayoutWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
});

const pageContainerRecipe = cva({
  base: {
    height: "100%",
  },
  defaultVariants: {
    padding: "medium",
  },
  variants: {
    padding: {
      none: {},
      medium: {
        paddingBlockStart: "xxlarge",
        paddingBlockEnd: "5xlarge",
      },
      large: {
        paddingBlockStart: "4xlarge",
        paddingBlockEnd: "5xlarge",
      },
    },
  },
});

export type PageContainerVariantProps = RecipeVariantProps<typeof pageContainerRecipe>;

export type PageContainerProps = HTMLArkProps<"div"> &
  JsxStyleProps &
  PageContentVariantProps &
  PageContainerVariantProps;

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ padding, css: cssProp, ...props }, ref) => (
    <PageContent css={css.raw(pageContainerRecipe.raw({ padding }), cssProp)} {...props} ref={ref} />
  ),
);