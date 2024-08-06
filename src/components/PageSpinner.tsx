/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef } from "react";
import { Spinner, SpinnerProps } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

interface Props extends SpinnerProps {}

const SpinnerWrapper = styled("div", {
  base: {
    paddingBlockStart: "4xlarge",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const PageSpinner = forwardRef<HTMLDivElement, Props>(({ ...rest }, ref) => {
  return (
    <SpinnerWrapper>
      <Spinner {...rest} ref={ref} />
    </SpinnerWrapper>
  );
});
