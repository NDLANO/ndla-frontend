/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@ndla/primitives";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { css } from "@ndla/styled-system/css";
import { styled } from "@ndla/styled-system/jsx";
import { routes } from "../../../routeHelpers";

const myNdlaButton = css.raw({
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

export const MoreButton = styled(Button, {
  base: {
    ...myNdlaButton,
    mobileWide: {
      display: "none",
    },
  },
});

const StyledSafeLink = styled(SafeLinkButton, {
  base: myNdlaButton,
});

const LongText = styled("span", {
  base: {
    desktopDown: {
      display: "none",
    },
  },
});

const ShortText = styled("span", {
  base: {
    desktop: {
      display: "none",
    },
  },
});

interface Props extends Omit<SafeLinkButtonProps, "children"> {
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
  to: string;
}

const NavigationLink = ({ icon, iconFilled, name, shortName, onClick, to, reloadDocument }: Props) => {
  const location = useLocation();
  const selected =
    to === routes.myNdla.root ? location.pathname === routes.myNdla.root : location.pathname.startsWith(to);
  const selectedIcon = selected ? iconFilled ?? icon : icon;

  return (
    <StyledSafeLink
      variant="tertiary"
      aria-current={selected ? "page" : undefined}
      to={to}
      reloadDocument={reloadDocument}
      onClick={onClick}
    >
      {selectedIcon}
      <LongText>{name}</LongText>
      <ShortText>{shortName}</ShortText>
    </StyledSafeLink>
  );
};

export default NavigationLink;
