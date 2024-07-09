/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Button } from "@ndla/primitives";
import { SafeLink, SafeLinkProps } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { DrawerListItem } from "./DrawerPortion";

interface BaseProps {
  bold?: boolean;
  type: "button" | "link";
  active?: boolean;
  id: string;
  current?: boolean;
}

interface DrawerMenuButtonProps extends BaseProps {
  type: "button";
  onClick: (expanded: boolean) => void;
  children?: ReactNode;
}

interface DrawerMenuLinkProps extends BaseProps, Omit<SafeLinkProps, "id"> {
  type: "link";
  onClose?: () => void;
}

const StyledButton = styled(Button, {
  base: {
    width: "100%",
    padding: "xsmall small",
    margin: "0 small",
    backgroundColor: "transparent",
    border: "0px",
    borderRadius: "xxsmall",
    color: "black",
    textAlign: "start",
    boxShadow: "none",
    cursor: "pointer",
    "&:last-of-type": {
      margin: "xsmall small",
    },
    "&:hover": {
      textDecoration: "underline",
    },
    "&:[data-bold='true']": {
      fontWeight: "bold",
      textStyle: "label.medium",
    },
    "&:[data-active='true']": {
      backgroundColor: "surface.brand.1",
      color: "white",
    },
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flex: "1",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "xsmall",
  },
});

const CurrentIndicator = styled("span", {
  base: {
    color: "currentColor",
  },
});

type Props = DrawerMenuButtonProps | DrawerMenuLinkProps;

const DrawerMenuItem = ({ bold, children, active, current, id, ...specificProps }: Props) =>
  specificProps.type === "button" ? (
    <DrawerListItem role="none" data-list-item>
      <StyledButton
        tabIndex={-1}
        role="menuitem"
        aria-current={current}
        aria-owns={`list-${id}`}
        aria-expanded={!!active}
        id={id}
        onClick={() => specificProps.onClick(!!active)}
        data-bold={bold}
        data-active={active}
      >
        <TextWrapper>
          {children}
          {current && <CurrentIndicator aria-hidden={true}>•</CurrentIndicator>}
        </TextWrapper>
      </StyledButton>
    </DrawerListItem>
  ) : (
    <DrawerListItem role="none" data-list-item>
      <SafeLink
        tabIndex={-1}
        role="menuitem"
        id={id}
        aria-current={current ? "page" : undefined}
        to={specificProps.to}
        onClick={specificProps.onClose}
        data-bold={bold}
        data-active={active}
      >
        <TextWrapper>
          {children}
          {current && <CurrentIndicator aria-hidden={true}>•</CurrentIndicator>}
        </TextWrapper>
      </SafeLink>
    </DrawerListItem>
  );

export default DrawerMenuItem;
