/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useState } from "react";
import { RightArrow } from "@ndla/icons/action";
import { StyledButton, StyledSafeLink } from "./DrawerMenuItem";
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

const DrawerRowHeader = ({ title, icon, active, id, current, ...rest }: Props) => {
  const [expanded, setExpanded] = useState(false);

  if (rest.type === "button") {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledButton
          tabIndex={-1}
          aria-owns={rest.ownsId}
          role="menuitem"
          aria-expanded={expanded}
          aria-current={current ? "page" : undefined}
          variant="tertiary"
          onClick={() => {
            setExpanded(true);
            rest.onClick();
          }}
          id={`header-${id}`}
          size="small"
        >
          {title}
          <RightArrow />
        </StyledButton>
      </DrawerListItem>
    );
  } else {
    return (
      <DrawerListItem role="none" data-list-item>
        <StyledSafeLink
          aria-current={current ? "page" : undefined}
          tabIndex={-1}
          role="menuitem"
          to={rest.to}
          onClick={rest.onClose}
          id={`header-${id}`}
          variant="link"
          size="small"
        >
          {title}
        </StyledSafeLink>
      </DrawerListItem>
    );
  }
};

export default DrawerRowHeader;
