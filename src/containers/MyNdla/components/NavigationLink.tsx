/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { breakpoints, mq, fonts } from "@ndla/core";
import { SafeLinkButton, SafeLinkButtonProps } from "@ndla/safelink";
import { Text } from "@ndla/typography";
import { routes } from "../../../routeHelpers";

const StyledSafeLink = styled(SafeLinkButton)`
  display: flex;
  align-self: center;
  justify-content: flex-start;

  ${mq.range({ until: breakpoints.desktop })} {
    flex-direction: column;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LongText = styled(Text)`
  font-weight: ${fonts.weight.semibold};
  &[data-current="true"] {
    font-weight: ${fonts.weight.bold};
  }
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
    width: 0px;
  }
`;

const ShortText = styled(Text)`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

interface Props extends Omit<SafeLinkButtonProps, "children"> {
  id: string;
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
}

const NavigationLink = ({ id, icon, iconFilled, name, shortName, onClick, to, reloadDocument }: Props) => {
  const location = useLocation();
  const selected = id
    ? location.pathname.startsWith(`${routes.myNdla.root}/${id}`)
    : location.pathname === routes.myNdla.root;
  const selectedIcon = selected ? iconFilled ?? icon : icon;

  return (
    <StyledSafeLink
      variant="tertiary"
      aria-current={selected ? "page" : undefined}
      to={to}
      reloadDocument={reloadDocument}
      onClick={onClick}
    >
      <IconWrapper>{selectedIcon}</IconWrapper>
      <LongText textStyle="meta-text-small" margin="none" data-current={selected}>
        {name}
      </LongText>
      <ShortText textStyle="meta-text-xxsmall" margin="none">
        {shortName}
      </ShortText>
    </StyledSafeLink>
  );
};

export default NavigationLink;
