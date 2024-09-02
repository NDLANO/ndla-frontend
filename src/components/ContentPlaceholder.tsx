/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { HTMLArkProps } from "@ark-ui/react";
import { PageContent, PageContentVariantProps, Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { JsxStyleProps } from "@ndla/styled-system/types";

const StyledPageContent = styled(PageContent, {
  base: {
    minHeight: "100vh",
    paddingBlockStart: "4xlarge",
    paddingBlockEnd: "5xlarge",
  },
});

export const ContentPlaceholder = forwardRef<
  HTMLDivElement,
  HTMLArkProps<"div"> & JsxStyleProps & PageContentVariantProps
>((props, ref) => {
  return (
    <StyledPageContent {...props} ref={ref}>
      <Skeleton css={{ width: "15%", marginBottom: "3xsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "55%", height: "xxlarge", marginBottom: "medium" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "xlarge", marginBottom: "4xsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "xlarge", marginBottom: "4xsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "xlarge", marginBottom: "xxlarge" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "surface.small", marginBottom: "large" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "medium", marginBottom: "xxsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "medium", marginBottom: "xxsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "medium", marginBottom: "xxsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "100%", height: "medium", marginBottom: "xxsmall" }}>&nbsp;</Skeleton>
      <Skeleton css={{ width: "55%", height: "medium", marginBottom: "xxsmall" }}>&nbsp;</Skeleton>
    </StyledPageContent>
  );
});
