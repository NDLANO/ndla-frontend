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
  padding: ${spacing.small} ${spacing.xxsmall};
  margin: 0;
  gap: ${spacing.xxsmall};
  box-shadow: none;

  color: ${colors.text.primary};
  font-weight: ${fonts.weight.normal};

  &[data-selected='true'] {
    color: ${colors.brand.primary};
    font-weight: ${fonts.weight.semibold};
  }

  ${fonts.sizes('16px')};

  :hover,
  :focus {
    color: ${colors.brand.primary};
  }
  svg {
    height: ${spacing.normal};
    width: ${spacing.normal};
  }

  ${mq.range({ from: breakpoints.tablet, until: breakpoints.desktop })} {
    flex-direction: column;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LongText = styled.span`
  ${mq.range({ from: breakpoints.tablet, until: breakpoints.desktop })} {
    display: none;
    width: 0px;
  }
`;

const ShortText = styled.span`
  ${mq.range({ from: breakpoints.desktop })} {
    display: none;
  }
  ${mq.range({ from: breakpoints.mobile, until: breakpoints.tablet })} {
    display: none;
  }
`;
interface Props {
  loading?: boolean;
  id: string;
  icon: ReactNode;
  name: string;
  shortName?: string;
  expanded?: boolean;
  to?: string;
}

const NavigationLink = ({
  loading,
  id,
  icon,
  name,
  shortName,
  expanded,
  to,
}: Props) => {
  const location = useLocation();
  const selected = location.pathname === `/minndla/${id}`;

  return (
    <StyledSafeLink
      role="tab"
      aria-expanded={expanded}
      aria-current={selected ? 'page' : undefined}
      tabIndex={0}
      data-selected={selected}
      to={loading ? '' : to ? to : `/minndla/${id}`}
      reloadDocument={!!to}
    >
      <IconWrapper>{icon}</IconWrapper>
      <LongText>{name}</LongText>
      <ShortText>{shortName}</ShortText>
    </StyledSafeLink>
  );
};

export default NavigationLink;
