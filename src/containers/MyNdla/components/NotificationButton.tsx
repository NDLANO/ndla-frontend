/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Bell } from '@ndla/icons/common';
import { HTMLAttributes, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLArenaNotificationFragmentFragment } from '../../../graphqlTypes';
import { iconCss } from '../Folders/FoldersPage';

const NotificationCounter = styled.div`
  position: relative;
  background: ${colors.support.red};
  color: ${colors.white};

  height: ${spacing.nsmall};
  padding: 0 ${spacing.xxsmall};
  font-size: ${spacing.small};
  border-radius: 2px;

  right: ${spacing.small};
  bottom: ${spacing.xsmall};

  &[data-align-left='true'] {
    right: ${spacing.normal};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  vertical-align: center;
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  notifications?: GQLArenaNotificationFragmentFragment[];
}

const NotificationBellButton = forwardRef<HTMLButtonElement, Props>(
  ({ notifications, ...rest }, ref) => {
    const { t } = useTranslation();
    const newNotifications = useMemo(
      () => notifications?.filter(({ read }) => !read).length,
      [notifications],
    );

    return (
      <ButtonV2 variant="ghost" colorTheme="lighter" ref={ref} {...rest}>
        {t('myNdla.arena.notification.title')}
        <BellIcon amountOfUnreadNotifications={newNotifications ?? 0} />
      </ButtonV2>
    );
  },
);

export default NotificationBellButton;
interface BellIconProps {
  amountOfUnreadNotifications: number;
  left?: boolean;
}

export const BellIcon = ({
  amountOfUnreadNotifications,
  left,
}: BellIconProps) => {
  return (
    <IconWrapper>
      <Bell css={iconCss} />
      {amountOfUnreadNotifications !== 0 && (
        <NotificationCounter data-align-left={left}>
          {amountOfUnreadNotifications > 99
            ? '99+'
            : amountOfUnreadNotifications}
        </NotificationCounter>
      )}
    </IconWrapper>
  );
};
