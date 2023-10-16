/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import SafeLink from '@ndla/safelink';
import { useTranslation } from 'react-i18next';
import { colors, spacing, breakpoints, mq, fonts, misc } from '@ndla/core';
import Icon from '@ndla/icons';
import { css } from '@emotion/react';
import { Forum, ForumOutlined, Locked } from '@ndla/icons/common';

interface Props {
  id: string;
  cardType: 'ArenaCategory' | 'ArenaTopic';
  title: string;
  subText: string;
  timestamp: string;
  count: number;
  locked?: boolean;
}

const StyledCategoryCard = css`
  background-color: ${colors.background.default};
  svg:nth-child(2) {
    display: none;
  }
  &:hover,
  &:focus-visible {
    background-color: ${colors.background.lightBlue};
    svg:nth-child(1) {
      display: none;
    }
    svg:nth-child(2) {
      display: block;
    }
  }
`;

const StyledTopicCard = css`
  background-color: ${colors.background.lightBlue};
  &:hover,
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
  &:hover,
  &:focus-visible {
    background-color: ${colors.brand.lighter};
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

const StyledDescriptionText = styled.div`
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledText = styled.div`
  margin: 0;
  color: ${colors.text.primary};
  padding-top: ${spacing.xsmall};
  ${fonts.sizes('16px', '26px')};
  font-weight: ${fonts.weight.normal};
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: ${spacing.xsmall};
  color: ${colors.text.primary};
  ${mq.range({ until: breakpoints.tabletWide })} {
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
    display: none;
  }
`;

const StyledLockedIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  color: ${colors.brand.primary};
`;

const FolderFilledIcon = StyledLeftIcon.withComponent(Forum);
const FolderOutlinedIcon = StyledLeftIcon.withComponent(ForumOutlined);
const LockedIcon = StyledLockedIcon.withComponent(Locked); //Temp før nye iconer kommer til biblioteket

const StyledAvatarContainer = styled.div`
  //Placeholder til avatar kommer
  margin-right: ${spacing.normal};
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.white};
  border: solid 1px ${colors.brand.tertiary};
  border-radius: 50px;
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const ArenaCard = ({
  id,
  cardType,
  title,
  subText,
  timestamp,
  count,
  locked,
}: Props) => {
  const { t } = useTranslation();
  return (
    <StyledCardContainer
      id={id}
      css={cardType === 'ArenaCategory' ? StyledCategoryCard : StyledTopicCard}
      to=""
    >
      {cardType === 'ArenaCategory' ? (
        <>
          <FolderOutlinedIcon />
          <FolderFilledIcon />
        </>
      ) : (
        <StyledAvatarContainer>R</StyledAvatarContainer>
      )}
      <StyledTextContainer>
        <StyledHeader>{title}</StyledHeader>
        {cardType === 'ArenaCategory' ? (
          <StyledDescriptionText>{subText}</StyledDescriptionText>
        ) : (
          <StyledText>
            {subText} | {timestamp}
          </StyledText>
        )}
      </StyledTextContainer>
      <StyledCountContainer>
        {locked ? (
          <LockedIcon />
        ) : (
          <>
            <StyledCountDiv>{count}</StyledCountDiv>
            <StyledText>
              {cardType === 'ArenaCategory'
                ? `${t('arena.category.posts')}`
                : `${t('arena.topic.responses')}`}
            </StyledText>
          </>
        )}
      </StyledCountContainer>
    </StyledCardContainer>
  );
};

export default ArenaCard;
