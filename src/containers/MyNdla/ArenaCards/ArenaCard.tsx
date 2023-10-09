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
import { css } from '@emotion/react';
import { MenuBook } from '@ndla/icons/lib/action';
import { Share } from '@ndla/icons/lib/common';

interface Props {
  id: string;
  cardType: 'ArenaCategory' | 'ArenaTopic';
  title: string;
  subText: string;
  created_at: string;
  count: number;
  locked?: boolean;
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

const StyledTopicCard = css`
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

const StyledLeftIcon = styled(Icon)`
  margin-right: ${spacing.normal};
  width: 40px;
  height: 40px;
  color: ${colors.brand.primary};
  ${mq.range({ until: breakpoints.mobileWide })} {
    // Usikker på breakpoint her
    display: none;
  }
`;

const StyledLockedIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${colors.brand.primary};
`;

const FolderIcon = StyledLeftIcon.withComponent(MenuBook);
const LockedIcon = StyledLockedIcon.withComponent(Share);

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
  id,
  cardType,
  title,
  subText,
  created_at,
  count,
  locked,
}: Props) => {
  return (
    <StyledCardContainer
      id={id}
      css={cardType === 'ArenaCategory' ? StyledCategoryCard : StyledTopicCard}
      to=""
    >
      {cardType === 'ArenaCategory' ? (
        <FolderIcon />
      ) : (
        <StyledAvatarContainer>R</StyledAvatarContainer>
      )}
      <StyledTextContainer>
        <StyledHeader>{title}</StyledHeader>
        <StyledText>
          {subText}
          {cardType === 'ArenaTopic' ? ` | ${created_at}` : ''}
        </StyledText>
      </StyledTextContainer>
      <StyledCountContainer>
        {locked ? (
          <LockedIcon />
        ) : (
          <>
            <StyledCountDiv>{count}</StyledCountDiv>
            <StyledText>
              {cardType === 'ArenaCategory' ? 'Innlegg' : 'Svar'}
            </StyledText>
          </>
        )}
      </StyledCountContainer>
    </StyledCardContainer>
  );
};

export default ArenaCard;
