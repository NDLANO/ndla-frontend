/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Text } from '@ndla/typography';
import SafeLink from '@ndla/safelink';
import {
  colors,
  spacing,
  breakpoints,
  mq,
  fonts,
  misc,
  spacingUnit,
} from '@ndla/core';
import Icon from '@ndla/icons';
import { Forum, ForumOutlined, Locked } from '@ndla/icons/common';
import { formatDateTime } from '../../../util/formatDate';

interface Props {
  id: string;
  cardType: 'ArenaCategory' | 'ArenaTopic';
  title: string;
  subText?: string;
  timestamp?: string;
  count: number;
  locked?: boolean;
}

const StyledCategoryCard = css`
  background-color: ${colors.background.default};
  svg:nth-of-type(2) {
    display: none;
  }
  &:hover,
  &:focus-visible {
    background-color: ${colors.background.lightBlue};
    svg:nth-of-type(1) {
      display: none;
    }
    svg:nth-of-type(2) {
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
  padding-right: ${spacing.medium};
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
  margin-left: ${spacing.normal};
  margin-right: auto;
  display: flex;
  flex-direction: column;
`;

const StyledHeader = styled(Text)`
  color: ${colors.brand.primary};
`;

const StyledDescriptionText = styled(Text)`
  padding-top: ${spacing.xsmall};
  color: ${colors.text.primary};
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledText = styled(Text)`
  color: ${colors.text.primary};
  padding-top: ${spacing.xsmall};
`;

const StyledCountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  min-width: 40px;
  height: 40px;
  color: ${colors.brand.primary};
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const StyledLockedIcon = styled(Icon)`
  width: ${spacingUnit};
  height: ${spacingUnit};
  color: ${colors.brand.primary};
`;

const FolderFilledIcon = StyledLeftIcon.withComponent(Forum);
const FolderOutlinedIcon = StyledLeftIcon.withComponent(ForumOutlined);
const LockedIcon = StyledLockedIcon.withComponent(Locked);

const ArenaCard = ({
  id,
  cardType,
  title,
  subText,
  timestamp,
  count,
  locked,
}: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <StyledCardContainer
      id={id}
      css={cardType === 'ArenaCategory' ? StyledCategoryCard : StyledTopicCard}
      to={
        cardType === 'ArenaCategory'
          ? `/minndla/arena/category/${id}`
          : `/minndla/arena/category/${id}/topic/${id}`
      } //temporary fix to make SafeLink work
    >
      {cardType === 'ArenaCategory' && (
        <>
          <FolderOutlinedIcon />
          <FolderFilledIcon />
        </>
      )}
      <StyledTextContainer>
        <StyledHeader element="label" textStyle="label-small" margin="none">
          {title}
        </StyledHeader>
        {cardType === 'ArenaCategory' ? (
          <StyledDescriptionText
            element="p"
            textStyle="meta-text-small"
            margin="none"
          >
            {subText}
          </StyledDescriptionText>
        ) : (
          <StyledText element="p" textStyle="meta-text-small" margin="none">
            {timestamp && formatDateTime(timestamp, i18n.language)}
          </StyledText>
        )}
      </StyledTextContainer>
      <StyledCountContainer>
        {locked ? (
          <LockedIcon />
        ) : (
          <>
            <StyledCountDiv>{count}</StyledCountDiv>
            <StyledText textStyle="meta-text-small" margin="none">
              {cardType === 'ArenaCategory'
                ? `${t('myNdla.arena.category.posts')}`
                : `${t('myNdla.arena.topic.responses')}`}
            </StyledText>
          </>
        )}
      </StyledCountContainer>
    </StyledCardContainer>
  );
};

export default ArenaCard;
