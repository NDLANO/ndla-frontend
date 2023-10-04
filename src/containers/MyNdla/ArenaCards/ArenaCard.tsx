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
import { css } from '@emotion/react';

interface Props {
  cardType: 'Category' | 'Post';
  leftIcon: ReactNode;
  header: string;
  subText: string;
  date?: string;
  count: number;
}

const StyledCategoryCard = css`
  background-color: ${colors.background.default};
  &:hover {
    background-color: ${colors.background.lightBlue};
  }
  &:focus-visible {
    background-color: ${colors.background.lightBlue};
  }
`;

const StyledPostCard = css`
  background-color: ${colors.background.lightBlue};
  &:hover {
    background-color: ${colors.brand.lighter};
  }
  &:focus-visible {
    background-color: ${colors.brand.lighter};
  }
`;

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
  ${mq.range({ until: breakpoints.tabletWide })} {
    // Usikker på breakpoint her
    display: none;
  }
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
  ${mq.range({ until: breakpoints.mobileWide })} {
    // Usikker på breakpoint her
    display: none;
  }
`;

const StyledAvatarContainer = styled.div`
  //Placeholder til avatar kommer
  margin-right: ${spacing.normal};
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: solid 1px ${colors.brand.tertiary};
  border-radius: 50px;
  ${mq.range({ until: breakpoints.mobileWide })} {
    // Usikker på breakpoint her
    display: none;
  }
`;

const ArenaCard = ({
  cardType,
  leftIcon,
  header,
  subText,
  date,
  count,
}: Props) => {
  return (
    <StyledCardContainer
      css={cardType === 'Category' ? StyledCategoryCard : StyledPostCard}
      to=""
    >
      {cardType === 'Category' ? (
        leftIcon
      ) : (
        <StyledAvatarContainer>R</StyledAvatarContainer>
      )}
      <StyledTextContainer>
        <StyledHeader>{header}</StyledHeader>
        <StyledText>
          {subText}
          {date ? ' | ' : ''}
          {date}
        </StyledText>
      </StyledTextContainer>
      <StyledCountContainer>
        <StyledCountDiv>{count}</StyledCountDiv>
        <StyledText>{cardType === 'Category' ? 'Innlegg' : 'Svar'}</StyledText>
      </StyledCountContainer>
    </StyledCardContainer>
  );
};

export default ArenaCard;
