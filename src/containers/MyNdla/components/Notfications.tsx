/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { colors, spacing } from '@ndla/core';
import { Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-popover';
import { NotificationsFilled } from '@ndla/icons/common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationList from './NotificationList';
import { SafeLinkButton } from '@ndla/safelink';
import { toAllNotifications } from '../../../routeHelpers';

const NotificationCounter = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${colors.support.red};
  color: ${colors.white};
  height: 13px;
  border-radius: 2px;
  padding: 0 ${spacing.xxsmall};
  font-size: ${spacing.small};
  text-align: center;
  right: ${spacing.small};
`;

const IconWrapper = styled.div`
  display: flex;
  vertical-align: center;
`;

const StyledBellIcon = styled(NotificationsFilled)`
  width: 20px;
  height: 20px;
`;

const StyledContent = styled(Content)`
  background-color: ${colors.background.default};
  box-shadow: 0 0 12px #ccc;
  padding: ${spacing.normal};
  gap: ${spacing.small};
`;

const StyledArrow = styled(Arrow)`
  fill: ${colors.white};
`;

const ShowAllButton = styled(SafeLinkButton)`
  width: 100%;
`;

const getNewNotifications = (notifications: any[]) =>
  notifications.filter((notification) => !notification.viewed).length;

interface Props {
  notifications: any[];
}

const Notifications = ({ notifications }: Props) => {
  const { t } = useTranslation();
  const newNotifications = useMemo(
    () => getNewNotifications(notifications),
    [notifications],
  );

  const markAllNotificationsAsRead = () => {};

  return (
    <Root>
      <Trigger asChild>
        <ButtonV2 variant="ghost" colorTheme="lighter">
          {t('myNdla.arena.notification.title')}
          <IconWrapper>
            <StyledBellIcon />
            {newNotifications !== 0 && (
              <NotificationCounter>
                {newNotifications > 99 ? '99+' : newNotifications}
              </NotificationCounter>
            )}
          </IconWrapper>
        </ButtonV2>
      </Trigger>
      <Portal>
        <StyledContent>
          <NotificationList
            notifications={notifications.slice(0, 5)}
            markAllRead={markAllNotificationsAsRead}
          />
          <ShowAllButton to={toAllNotifications()} fontWeight="bold">
            {t('myNdla.arena.notification.showAll')}
          </ShowAllButton>
          <StyledArrow />
        </StyledContent>
      </Portal>
    </Root>
  );
};

export default Notifications;
