/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { ArrowRightShortLine } from "@ndla/icons/common";
import { Button } from "@ndla/primitives";
import { SafeLinkButton, SafeLinkProps } from "@ndla/safelink";
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

export const StyledButton = styled(Button, {
  base: {
    position: "relative",
    display: "flex",
    textStyle: "label.medium",
    fontWeight: "normal",
    color: "text.default",
    textAlign: "start",
    paddingInline: "small",
    "&[data-current-selected='true']&:not(:is(:hover, :active))": {
      borderRadius: "0",
      _before: {
        position: "absolute",
        left: "0",
        content: '""',
        height: "100%",
        borderInlineStart: "6px solid",
        borderColor: "stroke.default",
      },
    },
  },
});

export const StyledSafeLink = styled(SafeLinkButton, {
  base: {
    position: "relative",
    fontWeight: "normal",
    textStyle: "text.link",
    paddingInline: "small",
    paddingBlock: "3xsmall",
    textAlign: "start",
    textUnderlineOffset: "var(--spacing-4xsmall)",
    _currentPage: {
      borderRadius: "0",
      _before: {
        position: "absolute",
        left: "0",
        content: '""',
        height: "100%",
        borderInlineStart: "6px solid",
        borderColor: "stroke.default",
      },
    },
  },
});

type Props = DrawerMenuButtonProps | DrawerMenuLinkProps;

const DrawerMenuItem = ({ bold, children, active, current, id, ...specificProps }: Props) => {
  return specificProps.type === "button" ? (
    <DrawerListItem role="none" data-list-item>
      <StyledButton
        tabIndex={-1}
        role="menuitem"
        aria-current={current}
        aria-owns={`list-${id}`}
        aria-expanded={!!active}
        id={id}
        onClick={() => specificProps.onClick(!!active)}
        variant="tertiary"
        size="small"
        data-current-selected={!!active}
      >
        {children}
        <ArrowRightShortLine />
      </StyledButton>
    </DrawerListItem>
  ) : (
    <DrawerListItem role="none" data-list-item>
      <StyledSafeLink
        tabIndex={-1}
        role="menuitem"
        id={id}
        aria-current={current ? "page" : undefined}
        to={specificProps.to.toString()}
        onClick={specificProps.onClose}
        variant="link"
        size="small"
      >
        {children}
      </StyledSafeLink>
    </DrawerListItem>
  );
};

export default DrawerMenuItem;
