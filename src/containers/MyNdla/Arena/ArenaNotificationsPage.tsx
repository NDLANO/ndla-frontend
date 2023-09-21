import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import MyNdlaBreadcrumb from '../components/MyNdlaBreadcrumb';
import MyNdlaTitle from '../components/MyNdlaTitle';
import NotificationList from '../components/NotificationList';
import TitleWrapper from '../components/TitleWrapper';

const Description = styled.div`
  padding: ${spacing.normal} 0;
`;

const ArenaNotificationPage = () => {
  const { t } = useTranslation();

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
      <NotificationList
        markAllRead={() => {}}
        notifications={[
          {
            viewed: false,
            fromUser: 'Kari Gunnersen',
            title: 'I have a dream',
            time: new Date(2023, 8, 17, 13, 0),
          },
          {
            viewed: false,
            fromUser: 'Torstein Kongsli',
            title: 'Dreams to believe',
            time: new Date(2023, 8, 19, 13, 0),
          },
          {
            viewed: false,
            fromUser: 'Torstein Kongsli',
            title: 'Fly hard and fast',
            time: new Date(2023, 7, 18, 13, 0),
          },
          {
            viewed: true,
            fromUser: 'Jonas Carlsen',
            title: 'King kong is back',
            time: new Date(2021, 7, 19, 13, 0),
          },
        ]}
      />
    </div>
  );
};

export default ArenaNotificationPage;
