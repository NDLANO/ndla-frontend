/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useLocation } from "react-router";
import { ExternalLinkLine } from "@ndla/icons";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { routes } from "../../../routeHelpers";

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

const StyledExternalLinkLine = styled(ExternalLinkLine, {
  base: {
    width: "small!",
    height: "small!",
  },
});

const ExternalWrapper = styled("span", {
  base: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4xsmall",
  },
});

interface Props extends Omit<SafeLinkButtonProps, "children" | "variant"> {
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
  to: string;
}

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    display: "flex",
    background: "surface.default",
    justifyContent: "flex-start",
    color: "text.default",
    fontWeight: "normal",
    paddingInline: "xsmall",
    desktopDown: {
      flexDirection: "column",
      textStyle: "label.xsmall",
    },
    tabletDown: {
      paddingInline: "3xsmall",
    },
    _hover: {
      boxShadow: "none",
      background: "surface.hover",
    },
    _active: {
      boxShadow: "none",
      background: "surface.active",
    },
    _currentPage: {
      fontWeight: "bold",
    },
  },
});

export const NavigationLink = ({ icon, iconFilled, name, shortName, onClick, to, reloadDocument }: Props) => {
  const location = useLocation();
  const selected =
    to === routes.myNdla.root ? location.pathname === routes.myNdla.root : location.pathname.startsWith(to);
  const selectedIcon = selected ? (iconFilled ?? icon) : icon;
  const external = to.startsWith("http");

  return (
    <StyledSafeLinkButton
      aria-current={selected ? "page" : undefined}
      to={to}
      variant="tertiary"
      reloadDocument={reloadDocument}
      onClick={onClick}
      target={external ? "_blank" : undefined}
    >
      {selectedIcon}
      <LongText>{name}</LongText>
      {external ? (
        <ExternalWrapper>
          <ShortText>{shortName}</ShortText>
          <StyledExternalLinkLine />
        </ExternalWrapper>
      ) : (
        <ShortText>{shortName}</ShortText>
      )}
    </StyledSafeLinkButton>
  );
};
