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
  misc,
  spacingUnit,
} from '@ndla/core';
import Icon from '@ndla/icons';
import { Locked } from '@ndla/icons/common';
import { formatDateTime } from '../../../util/formatDate';

interface Props {
  id: string;
  title: string;
  timestamp: string;
  count: number;
  locked?: boolean;
}
const StyledSafelink = styled(SafeLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const TopicCardCSS = css`
  background-color: ${colors.background.lightBlue};
  &:hover,
  &:focus-visible {
    background-color: ${colors.brand.lighter};
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
  text-decoration: underline;
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

const StyledLockedIcon = styled(Icon)`
  width: ${spacingUnit};
  height: ${spacingUnit};
  color: ${colors.brand.primary};
`;

const LockedIcon = StyledLockedIcon.withComponent(Locked);

const TopicCard = ({ id, title, locked, timestamp, count }: Props) => {
  const { t, i18n } = useTranslation();

  return (
    <StyledSafelink
      id={id}
      css={TopicCardCSS}
      to={`/minndla/arena/topic/${id}`}
    >
      <StyledTextContainer>
        <StyledHeader
          element="label"
          textStyle="label-small"
          margin="none"
          data-name="hover"
        >
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
            <Text element="p" textStyle="content-alt" margin="none">
              {count}
            </Text>
            <StyledText textStyle="meta-text-small" margin="none">
              {t('myNdla.arena.topic.responses')}
            </StyledText>
          </>
        )}
      </StyledCountContainer>
    </StyledSafelink>
  );
};

export default TopicCard;
