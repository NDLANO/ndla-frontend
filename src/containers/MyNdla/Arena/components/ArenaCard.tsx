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
import { colors, spacing, breakpoints, mq, misc } from '@ndla/core';
import { Forum, ForumOutlined } from '@ndla/icons/common';
import SafeLink from '@ndla/safelink';
import { Text } from '@ndla/typography';
import { toArenaCategory } from '../utils';

interface Props {
  id: number;
  title: string;
  subText: string;
  count: number;
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
    svg {
      display: none;
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

const iconCss = css`
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
    <StyledSafelink to={toArenaCategory(id)}>
      <ForumOutlined css={iconCss} />
      <Forum data-hover-icon="" css={iconCss} />
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
