/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import styled from '@emotion/styled';
import { Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-popover';
import { useTranslation } from 'react-i18next';
import NotificationList from './NotificationList';
import { toAllNotifications } from '../../../routeHelpers';
import NotificationBellButton from './NotificationButton';
import { GQLArenaNotification } from '../../../graphqlTypes';

const StyledContent = styled(Content)`
  background-color: ${colors.background.default};
  box-shadow: 0 0 ${spacing.nsmall} #ccc;
  padding: ${spacing.normal};
  gap: ${spacing.small};
`;

const StyledArrow = styled(Arrow)`
  fill: ${colors.white};
`;

const ShowAllButton = styled(SafeLinkButton)`
  width: 100%;
`;

interface Props {
  notifications: GQLArenaNotification[];
}

const Notifications = ({ notifications }: Props) => {
  const { t } = useTranslation();

  return (
    <Root>
      <Trigger asChild>
        <NotificationBellButton notifications={notifications} />
      </Trigger>
      <Portal>
        <StyledContent>
          <NotificationList notifications={notifications} isButton />
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
