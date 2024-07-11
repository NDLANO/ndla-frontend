/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { RightArrow } from "@ndla/icons/action";
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

export const StyledButton = styled(Button, {
  base: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
    textStyle: "label.medium",
    fontWeight: "light",
    alignItems: "start",
    textAlign: "start",
    justifyContent: "start",
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
      >
        {children}
        <RightArrow />
      </StyledButton>
    </DrawerListItem>
  ) : (
    <DrawerListItem role="none" data-list-item>
      <StyledButton variant="link" size="small" asChild consumeCss>
        <SafeLink
          tabIndex={-1}
          role="menuitem"
          id={id}
          aria-current={current ? "page" : undefined}
          to={specificProps.to}
          onClick={specificProps.onClose}
        >
          {children}
        </SafeLink>
      </StyledButton>
    </DrawerListItem>
  );
};

export default DrawerMenuItem;
