/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { colors, spacing } from '@ndla/core';
import { SafeLinkButton } from '@ndla/safelink';
import styled from '@emotion/styled';
import { Root, Trigger, Portal, Content, Arrow } from '@radix-ui/react-popover';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationList from './NotificationList';
import { toAllNotifications } from '../../../routeHelpers';
import NotificationBellButton from './NotificationButton';
import { useArenaNotifications } from '../arenaQueries';

const StyledContent = styled(Content)`
  background-color: ${colors.background.default};
  box-shadow: 0 0 ${spacing.nsmall} ${colors.black}7f;
  padding: ${spacing.normal};
  gap: ${spacing.small};
  min-width: 350px;
  border-radius: ${spacing.xxsmall};
`;

const StyledArrow = styled(Arrow)`
  fill: ${colors.white};
`;

const ShowAllButton = styled(SafeLinkButton)`
  width: 100%;
`;

const StyledPortal = styled(Portal)`
  right: 50px;
`;

const NotificationPopover = () => {
  const { notifications } = useArenaNotifications();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <Root open={open} onOpenChange={setOpen}>
      <Trigger asChild>
        <NotificationBellButton notifications={notifications} />
      </Trigger>
      <StyledPortal>
        <StyledContent align="end">
          <StyledArrow />
          <NotificationList notifications={notifications} inPopover />
          <ShowAllButton
            to={toAllNotifications()}
            onClick={() => setOpen(false)}
            fontWeight="bold"
          >
            {t('myNdla.arena.notification.showAll')}
          </ShowAllButton>
        </StyledContent>
      </StyledPortal>
    </Root>
  );
};

export default NotificationPopover;
