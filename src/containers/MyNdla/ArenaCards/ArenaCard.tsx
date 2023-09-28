/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import SafeLink from '@ndla/safelink';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';
import Icon from '@ndla/icons';
import { ReactNode } from 'react';

interface Props {
  leftIcon: ReactNode;
}

const StyledCardContainer = styled(SafeLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: ${spacing.normal};
  border: 1px solid ${colors.brand.light};
  border-radius: ${misc.borderRadius};
  box-shadow: none;
  > * > span {
    text-decoration: underline;
  }
  // text decoration skal ikke dukke opp på undertekst
  &:hover {
    background-color: ${colors.background.lightBlue};
    > * > span {
      text-decoration: none;
    }
  }
  &:focus-visible {
    background-color: ${colors.background.lightBlue};
    border-color: #025fcc;
    > * > span {
      text-decoration: none;
    }
  }
`;

const StyledTextContainer = styled.div`
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled.span`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
  color: ${colors.brand.primary};
  margin: 0;
`;

const StyledText = styled.div`
  margin: 0;
  color: ${colors.text.primary};
  padding-top: ${spacing.xsmall};
  ${fonts.sizes('16px', '26px')};
  font-weight: ${fonts.weight.normal};
  ${mq.range({ until: breakpoints.tabletWide })} {
    // Usikker på breakpoint her
    display: none;
  }
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${colors.text.primary};
`;

const StyledCountDiv = styled.div`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
`;

export const StyledLeftIcon = styled(Icon)`
  margin-right: ${spacing.normal};
  width: 40px;
  height: 40px;
  color: ${colors.brand.primary};
  ${mq.range({ until: breakpoints.tabletWide })} {
    // Usikker på breakpoint her
    display: none;
  }
`;

const ArenaCard = ({ leftIcon }: Props) => {
  return (
    <StyledCardContainer to="">
      {leftIcon}
      <StyledTextContainer>
        <StyledHeader>Navn på kategori </StyledHeader>
        <StyledText>Beskrivelse</StyledText>
      </StyledTextContainer>
      <StyledCountContainer>
        <StyledCountDiv>20</StyledCountDiv>
        <StyledText>Innlegg</StyledText>
      </StyledCountContainer>
    </StyledCardContainer>
  );
};

export default ArenaCard;
