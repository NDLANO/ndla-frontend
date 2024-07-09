/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { ForwardArrow, RightArrow } from "@ndla/icons/action";
import { Button } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { DrawerListItem } from "./DrawerPortion";

interface BaseProps {
  id?: string;
  title: string;
  icon?: ReactNode;
  active?: boolean;
  tabIndex?: number;
  type: "link" | "button";
  current?: boolean;
}

interface ButtonProps extends BaseProps {
  type: "button";
  onClick: () => void;
  ownsId: string;
}

interface LinkProps extends BaseProps {
  type: "link";
  to: string;
  onClose: () => void;
}

type Props = ButtonProps | LinkProps;

const StyledButton = styled(Button, {
  base: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    textDecoration: "none",
    padding: "small small small normal",
    color: "black",
    fontWeight: "bold",
    border: "0",
    "& > svg": {
      minWidth: "normal",
      minHeight: "normal",
      width: "normal",
      height: "normal",
    },
    borderBottom: "1px solid gray",
    borderRadius: "0",
    "&:hover, &:focus": {
      border: "0",
      borderBottom: "1px solid gray",
    },
  },
});

const IconTitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    alignItems: "center",
    justifyContent: "center",
  },
});

const DrawerRowHeader = ({ title, icon, active, id, current, ...rest }: Props) => {
  const [expanded, setExpanded] = useState(false);

  const contents = (
    <IconTitleWrapper>
      {icon}
      {title}
    </IconTitleWrapper>
  );

  if (rest.type === "button") {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledButton
          tabIndex={-1}
          aria-owns={rest.ownsId}
          role="menuitem"
          aria-expanded={expanded}
          aria-current={current ? "page" : undefined}
          onClick={() => {
            setExpanded(true);
            rest.onClick();
          }}
          id={`header-${id}`}
        >
          {contents}
          <RightArrow />
        </StyledButton>
      </DrawerListItem>
    );
  } else {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledButton asChild>
          <SafeLink
            aria-current={current ? "page" : undefined}
            tabIndex={-1}
            role="menuitem"
            to={rest.to}
            onClick={rest.onClose}
            id={`header-${id}`}
          >
            {contents}
            <ForwardArrow />
          </SafeLink>
        </StyledButton>
      </DrawerListItem>
    );
  }
};

export default DrawerRowHeader;
