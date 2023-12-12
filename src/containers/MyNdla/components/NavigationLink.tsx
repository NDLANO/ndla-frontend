/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, mq, spacing } from '@ndla/core';
import { ReactNode } from 'react';
import { SafeLinkButton } from '@ndla/safelink';
import { useLocation } from 'react-router-dom';
import { Text } from '@ndla/typography';

const StyledSafeLink = styled(SafeLinkButton)`
  color: ${colors.brand.primary};

  svg {
    height: ${spacing.normal};
    width: ${spacing.normal};
  }

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

interface Props {
  id: string;
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
  to?: string;
  onClick?: () => void;
}

const NavigationLink = ({
  id,
  icon,
  iconFilled,
  name,
  shortName,
  onClick,
  to,
}: Props) => {
  const location = useLocation();
  const selected = id
    ? location.pathname.startsWith(`/minndla/${id}`)
    : location.pathname === '/minndla';
  const selectedIcon = selected ? iconFilled ?? icon : icon;
  const linkTo = to ?? `/minndla${id ? `/${id}` : ''}`;

  return (
    <StyledSafeLink
      shape="sharp"
      colorTheme="lighter"
      inverted
      aria-current={selected ? 'page' : undefined}
      to={linkTo}
      reloadDocument={!!to}
      onClick={onClick}
    >
      <IconWrapper>{selectedIcon}</IconWrapper>
      <LongText textStyle="meta-text-small" margin="none">
        {name}
      </LongText>
      <ShortText textStyle="meta-text-xxsmall" margin="none">
        {shortName}
      </ShortText>
    </StyledSafeLink>
  );
};

export default NavigationLink;
