import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import NotificationList from '../components/NotificationList';
import TitleWrapper from '../components/TitleWrapper';
import { useArenaNotifications } from '../arenaQueries';

const Description = styled.div`
  padding: ${spacing.normal} 0;
`;

const ArenaNotificationPage = () => {
  const { t } = useTranslation();
  const { notifications } = useArenaNotifications();
  console.log(notifications);
  return (
    <div>
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
          backCrumb="arena"
        />
        <MyNdlaTitle title={t('myNdla.arena.notification.myNotification')} />
      </TitleWrapper>
      <Description>{t('myNdla.arena.notification.description')}</Description>
      <NotificationList markAllRead={() => {}} notifications={notifications} />
    </div>
  );
};

export default ArenaNotificationPage;
