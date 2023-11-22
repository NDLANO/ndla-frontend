import { ButtonV2 } from '@ndla/button';
import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import { Bell } from '@ndla/icons/common';
import { HTMLAttributes, forwardRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SafeLinkButton } from '@ndla/safelink';
import { toAllNotifications } from '../../../routeHelpers';
import { GQLArenaNotificationFragmentFragment } from '../../../graphqlTypes';

const NotificationCounter = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${colors.support.red};
  color: ${colors.white};
  height: ${spacing.nsmall};
  right: ${spacing.xsmall};
  bottom: ${spacing.xsmall};
  padding: 0 ${spacing.xxsmall};
  font-size: ${spacing.small};
  text-align: center;
  border-radius: 2px;
`;

const IconWrapper = styled.div`
  display: flex;
  vertical-align: center;
`;

const StyledBellIcon = styled(Bell)`
  width: 20px;
  height: 20px;
`;

interface Props extends HTMLAttributes<HTMLButtonElement> {
  notifications?: GQLArenaNotificationFragmentFragment[];
  type?: 'link';
}

const NotificationBellButton = forwardRef<HTMLButtonElement, Props>(
  ({ notifications, type, ...rest }, ref) => {
    const { t } = useTranslation();
    const newNotifications = useMemo(
      () => notifications?.filter(({ read }) => !read).length,

      [notifications],
    );

    if (type === 'link') {
      return (
        <SafeLinkButton
          variant="ghost"
          colorTheme="lighter"
          to={toAllNotifications()}
        >
          <BellIcon amountOfUnreadNotifications={newNotifications ?? 0} />
          {t('myNdla.arena.notification.title')}
        </SafeLinkButton>
      );
    }

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
}

export const BellIcon = ({ amountOfUnreadNotifications }: BellIconProps) => {
  return (
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
  );
};
