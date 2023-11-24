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
  categoryId?: string;
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

const TopicCardCSS = css`
  background-color: ${colors.background.lightBlue};
  &:hover,
  &:focus-visible {
    background-color: ${colors.brand.lighter};
  }
`;

const StyledSafelink = styled(SafeLink)`
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
  categoryId,
}: Props) => {
  const { t, i18n } = useTranslation();

  if (cardType === 'ArenaCategory') {
    return (
      <StyledSafelink
        id={id}
        css={StyledCategoryCard}
        to={`/minndla/arena/category/${id}`}
      >
        <>
          <FolderOutlinedIcon />
          <FolderFilledIcon />
        </>
        <StyledTextContainer>
          <StyledHeader element="label" textStyle="label-small" margin="none">
            {title}
          </StyledHeader>
          <StyledDescriptionText
            element="p"
            textStyle="meta-text-small"
            margin="none"
          >
            {subText}
          </StyledDescriptionText>
        </StyledTextContainer>
        <StyledCountContainer>
          <Text element="p" textStyle="content-alt" margin="none">{count}</Text>
          <StyledText textStyle="meta-text-small" margin="none">
            {t('myNdla.arena.category.posts')}
          </StyledText>
        </StyledCountContainer>
      </StyledSafelink>
    );
  }

  return (
    <StyledSafelink
      id={id}
      css={TopicCardCSS}
      to={`/minndla/arena/category/${categoryId}/topic/${id}`}
    >
      <StyledTextContainer>
        <StyledHeader element="label" textStyle="label-small" margin="none">
          {title}
        </StyledHeader>
        <StyledText element="p" textStyle="meta-text-small" margin="none">
          {timestamp && formatDateTime(timestamp, i18n.language)}
        </StyledText>
      </StyledTextContainer>
      <StyledCountContainer>
        {locked ? (
          <LockedIcon />
        ) : (
          <>
            <Text element="p" textStyle="content-alt" margin="none">{count}</Text>
            <StyledText textStyle="meta-text-small" margin="none">
              {t('myNdla.arena.topic.responses')}
            </StyledText>
          </>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default ArenaCard;
