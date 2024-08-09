/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Skeleton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { OneColumn } from "@ndla/ui";

const Wrapper = styled("div", {
  base: {
    padding: "100px",
    minHeight: "100vh",
  },
});

export const ContentPlaceholder = () => {
  return (
    <OneColumn>
      <Wrapper>
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
      </Wrapper>
    </OneColumn>
  );
};
