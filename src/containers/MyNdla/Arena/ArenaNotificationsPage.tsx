/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { spacing } from '@ndla/core';
import { HelmetWithTracker } from '@ndla/tracker';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import NotificationList from '../components/NotificationList';
import TitleWrapper from '../components/TitleWrapper';
import { useArenaNotifications } from '../arenaQueries';
import MyNdlaPageWrapper from '../components/MyNdlaPageWrapper';

const Description = styled.div`
  padding: ${spacing.normal} 0;
`;

const ArenaNotificationPage = () => {
  const { t } = useTranslation();
  const { notifications } = useArenaNotifications();
  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker
        title={t('myNdla.arena.notification.myNotification')}
      />
      <TitleWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={[
            {
              id: 'notification',
              name: t('myNdla.arena.notification.myNotification'),
            },
          ]}
          page="arena"
        />
        <MyNdlaTitle title={t('myNdla.arena.notification.myNotification')} />
      </TitleWrapper>
      <Description>{t('myNdla.arena.notification.description')}</Description>
      <NotificationList notifications={notifications} />
    </MyNdlaPageWrapper>
  );
};

export default ArenaNotificationPage;
