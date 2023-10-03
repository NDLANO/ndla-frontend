import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { NotificationsFilled } from '@ndla/icons/common';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import { toAllNotifications } from '../../../routeHelpers';
import { useMemo } from 'react';

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

const getNewNotifications = (notifications: any[]) =>
  notifications.filter((notification) => !notification.viewed).length;

interface Props {
  notifications: any[];
  type?: 'link';
}

const NotificationBellButton = ({ notifications, type }: Props) => {
  const newNotifications = useMemo(
    () => getNewNotifications(notifications),
    [notifications],
  );

  if (type === 'link') {
    return (
      <SafeLinkButton
        variant="ghost"
        colorTheme="lighter"
        to={toAllNotifications()}
      >
        <BellIcon amountOfUnreadNotifications={newNotifications} />
      </SafeLinkButton>
    );
  }

  return (
    <ButtonV2 variant="ghost" colorTheme="lighter">
      <BellIcon amountOfUnreadNotifications={newNotifications} />
    </ButtonV2>
  );
};

export default NotificationBellButton;

interface BellIconProps {
  amountOfUnreadNotifications: number;
}

const BellIcon = ({ amountOfUnreadNotifications }: BellIconProps) => {
  const { t } = useTranslation();

  return (
    <>
      {t('myNdla.arena.notification.title')}
      <IconWrapper>
        <StyledBellIcon />
        {amountOfUnreadNotifications !== 0 && (
          <NotificationCounter>
            {amountOfUnreadNotifications > 99
              ? '99+'
              : amountOfUnreadNotifications}
          </NotificationCounter>
        )}
      </IconWrapper>
    </>
  );
};
