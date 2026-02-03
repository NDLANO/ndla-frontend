/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ark } from "@ark-ui/react";
import { ExternalLinkLine } from "@ndla/icons";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { StyledVariantProps } from "@ndla/styled-system/types";
import { ReactElement } from "react";
import { useLocation } from "react-router";
import { routes } from "../../../routeHelpers";

export const MenuContainer = styled(
  ark.div,
  {
    base: {
      background: "surface.default",
      boxShadow: "xsmall",
      borderRadius: "xsmall",
      padding: "xxsmall",
      height: "fit-content",
    },
  },
  { baseComponent: true },
);

export const MenuList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
    width: "100%",
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    display: "flex",
    background: "surface.default",
    justifyContent: "flex-start",
    color: "text.default",
    fontWeight: "normal",
    paddingInline: "xsmall",
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
  variants: {
    context: {
      desktop: {
        desktopDown: {
          flexDirection: "column",
          textStyle: "label.xsmall",
        },
        tabletDown: {
          paddingInline: "3xsmall",
        },
      },
      handheld: {},
    },
  },
});

export interface MenuLink {
  id: string;
  name: string;
  to: string;
  shortName?: string;
  icon?: ReactElement;
  iconFilled?: ReactElement;
  hiddenForUser?: boolean;
  reloadDocument?: boolean;
  showSeparator?: boolean;
}

type MenuLinkVariantProps = Required<NonNullable<StyledVariantProps<typeof StyledSafeLinkButton>>>;

interface MenuListItem extends MenuLinkVariantProps {
  link: MenuLink;
}

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

const StyledLi = styled("li", {
  base: {
    width: "100%",
  },
});

const Separator = styled("hr", {
  base: {
    height: "1px",
    color: "stroke.subtle",
    margin: "small",
  },
});

export const MenuListItem = ({ link, context }: MenuListItem) => {
  const location = useLocation();
  const selected =
    link.to === routes.myNdla.root ? location.pathname === routes.myNdla.root : location.pathname.startsWith(link.to);
  const selectedIcon = selected ? (link.iconFilled ?? link.icon) : link.icon;
  const external = link.to.startsWith("http");

  if (link.hiddenForUser) return null;

  return (
    <StyledLi>
      {link.showSeparator ? <Separator aria-hidden={true} /> : null}
      <StyledSafeLinkButton
        context={context}
        aria-current={selected ? "page" : undefined}
        to={link.to}
        variant="tertiary"
        reloadDocument={link.reloadDocument}
        target={external ? "_blank" : undefined}
      >
        {selectedIcon}
        <LongText>{link.name}</LongText>
        {external ? (
          <ExternalWrapper>
            <ShortText>{link.shortName}</ShortText>
            <StyledExternalLinkLine />
          </ExternalWrapper>
        ) : (
          <ShortText>{link.shortName}</ShortText>
        )}
      </StyledSafeLinkButton>
    </StyledLi>
  );
};
