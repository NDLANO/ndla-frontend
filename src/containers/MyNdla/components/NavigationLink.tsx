/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { breakpoints, colors, fonts, mq, spacing } from '@ndla/core';
import { ReactNode } from 'react';
import SafeLink from '@ndla/safelink';
import { useLocation } from 'react-router-dom';

const StyledSafeLink = styled(SafeLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.small};
  margin: 0;
  gap: ${spacing.xxsmall};
  box-shadow: none;

  color: ${colors.brand.primary};
  font-weight: ${fonts.weight.normal};

  &[data-selected='true'] {
    color: ${colors.brand.primary};
    font-weight: ${fonts.weight.semibold};
  }

  ${fonts.sizes('16px')};

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

const LongText = styled.span`
  ${mq.range({ until: breakpoints.desktop })} {
    display: none;
    width: 0px;
  }
`;

const ShortText = styled.span`
  ${fonts.sizes('10px', '12px')};

  ${mq.range({ from: breakpoints.mobileWide })} {
    font-weight: ${fonts.weight.bold};
  }
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
`;

interface Props {
  loading?: boolean;
  id: string;
  icon: ReactNode;
  iconFilled?: ReactNode;
  name: string;
  shortName?: string;
  expanded?: boolean;
  to?: string;
  onClick?: () => void;
}

const NavigationLink = ({
  loading,
  id,
  icon,
  iconFilled,
  name,
  shortName,
  expanded,
  to,
  onClick,
}: Props) => {
  const location = useLocation();
  const selected =
    location.pathname === `/minndla/${id}` ||
    (id === '' && location.pathname === `/minndla`);

  return (
    <StyledSafeLink
      role="tab"
      aria-expanded={expanded}
      aria-current={selected ? 'page' : undefined}
      tabIndex={0}
      data-selected={selected}
      to={loading ? '' : to ? to : `/minndla/${id}`}
      reloadDocument={!!to}
      onClick={onClick}
    >
      <IconWrapper>{selected ? iconFilled ?? icon : icon}</IconWrapper>
      <LongText>{name}</LongText>
      <ShortText>{shortName}</ShortText>
    </StyledSafeLink>
  );
};

export default NavigationLink;
