/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Button, ButtonProps } from "@ndla/primitives";
import { css } from "@ndla/styled-system/css";

const myNdlaButtonStyle = css.raw({
  display: "flex",
  justifyContent: "flex-start",
  color: "text.default",
  fontWeight: "normal",
  paddingInline: "xsmall",
  height: "100%",
  boxShadow: "inset 0 0 0 1px var(--shadow-color)",
  boxShadowColor: "transparent",
  desktopDown: {
    flexDirection: "column",
    textStyle: "label.xsmall",
  },
  tabletDown: {
    paddingInline: "3xsmall",
  },
  _currentPage: {
    fontWeight: "bold",
  },
  _hover: {
    background: "surface.action.myNdla.hover",
    boxShadowColor: "stroke.warning",
  },
  _active: {
    background: "surface.action.myNdla",
  },
  _focusVisible: {
    boxShadowColor: "stroke.default",
  },
});

interface MyNdlaButtonProps extends Omit<ButtonProps, "variant"> {}

export const MyNdlaButton = ({ css: cssProp, ...props }: MyNdlaButtonProps) => {
  return <Button variant="tertiary" css={css.raw(myNdlaButtonStyle, cssProp)} {...props} />;
};
