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
      // The minimum page height should be 100vh - (masthead height - half of zendesk button)
      minHeight: "calc(100vh - (var(--masthead-height, 80px) - token(spacing.medium)))",
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
  defaultVariants: {
    padding: "medium",
  },
  variants: {
    padding: {
      none: {},
      small: {
        paddingBlockStart: "medium",
        paddingBlockEnd: "5xlarge",
      },
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
