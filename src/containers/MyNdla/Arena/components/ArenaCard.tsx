/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from 'html-react-parser';
import { useTranslation } from 'react-i18next';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Text } from '@ndla/typography';
import SafeLink from '@ndla/safelink';
import { colors, spacing, breakpoints, mq, misc } from '@ndla/core';
import { Forum, ForumOutlined } from '@ndla/icons/common';

interface Props {
  id: string;
  title: string;
  subText: string;
  count: number;
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

  &:hover,
  &:focus-visible {
    background-color: ${colors.brand.lighter};
    [data-name='hover'] {
      text-decoration: none;
    }
  }
`;

const SpacingContainer = styled.div`
  display: flex;
  flex-direction: row;
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
  ${mq.range({ until: breakpoints.tabletWide })} {
    display: none;
  }
`;

const LeftIconCSS = css`
  width: ${spacing.large};
  height: ${spacing.large};
  color: ${colors.brand.primary};
  ${mq.range({ until: breakpoints.mobileWide })} {
    display: none;
  }
`;

const ArenaCard = ({ id, title, subText, count }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledSafelink
      id={id}
      css={StyledCategoryCard}
      to={`/minndla/arena/category/${id}`}
    >
      <ForumOutlined css={LeftIconCSS} />
      <Forum css={LeftIconCSS} />
      <SpacingContainer>
        <div>
          <StyledHeader
            element="label"
            textStyle="label-small"
            margin="none"
            data-name="hover"
          >
            {parse(title)}
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
            {count}
          </Text>
          <Text textStyle="meta-text-small" margin="none">
            {t('myNdla.arena.category.posts')}
          </Text>
        </StyledCountContainer>
      </SpacingContainer>
    </StyledSafelink>
  );
};

export default ArenaCard;
