/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing, breakpoints, mq, misc } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';

interface Props {
  to: string;
  title: string;
  subText: string;
  rightText?: string;
  icon: React.ReactNode;
}

const StyledSafelink = styled(SafeLink)`
  color: ${colors.text.primary};
  display: flex;
  flex-direction: row;
  gap: ${spacing.normal};
  padding: ${spacing.normal};
  padding-right: ${spacing.medium};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  box-shadow: none;

  [data-hover-icon=''] {
    display: none;
  }

  &:hover,
  &:focus-within {
    background-color: ${colors.background.lightBlue};
    [data-name='hover'] {
      text-decoration: none;
    }
  }

  ${mq.range({ from: breakpoints.mobileWide })} {
    &:hover,
    &:focus-within {
      [data-hover-icon=''] {
        display: block;
      }
    }
  }

  svg {
    width: ${spacing.large};
    height: ${spacing.large};
    color: ${colors.brand.primary};
    ${mq.range({ until: breakpoints.mobileWide })} {
      display: none;
    }
  }
`;

const SpacingContainer = styled.div`
  display: flex;
  gap: ${spacing.normal};
  justify-content: space-between;
  width: 100%;
`;

const StyledHeader = styled(Text)`
  color: ${colors.brand.primary};
  text-decoration: underline;
  cursor: pointer;
`;

const StyledDescriptionText = styled(Text)`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledCountContainer = styled.div`
  text-align: center;
`;

const NavWrapper = styled.li`
  list-style: none;
  margin: 0;
`;

const AdminNavLink = ({ to, title, subText, rightText, icon }: Props) => {
  return (
    <NavWrapper>
      <StyledSafelink to={to}>
        {icon}
        <SpacingContainer>
          <div>
            <StyledHeader
              element="label"
              textStyle="label-small"
              margin="none"
              data-name="hover"
            >
              {title}
            </StyledHeader>
            <StyledDescriptionText
              element="p"
              textStyle="meta-text-small"
              margin="none"
            >
              {subText}
            </StyledDescriptionText>
          </div>
          <StyledCountContainer>
            <Text element="p" textStyle="content-alt" margin="none">
              {rightText}
            </Text>
          </StyledCountContainer>
        </SpacingContainer>
      </StyledSafelink>
    </NavWrapper>
  );
};

export default AdminNavLink;
