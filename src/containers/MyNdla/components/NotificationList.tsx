import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors, fonts } from '@ndla/core';
import { HelpCircleDual, KeyboardReturn } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyledUl } from '../../SharedFolderPage/components/Folder';
import { formatDistanceStrict } from 'date-fns';
import { nb, nn, enGB } from 'date-fns/locale';
import { GQLArenaNotificationFragmentFragment } from '../../../graphqlTypes';
import { useMarkNotificationsAsRead } from '../arenaQueries';

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.normal};
`;

const StyledDot = styled(HelpCircleDual)`
  min-height: 10px;
  min-width: 10px;
  max-width: 10px;
  max-height: 10px;
  color: ${colors.brand.primary};
`;

const StyledLink = styled(SafeLinkButton)`
  display: flex;
  border: solid 1px ${colors.brand.greyLight};
  justify-content: space-between;
  padding: ${spacing.small};

  &[data-not-viewed='true'] {
    background-color: ${colors.brand.lightest};
    border: solid 1px ${colors.brand.lighter};
  }

  &:hover {
    background-color: ${colors.brand.lighter};
    border: solid 1px ${colors.brand.light};
    color: ${colors.text.primary};
  }
`;

const Notification = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing.small};

  div {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const StyledList = styled(StyledUl)`
  list-style: none;
  gap: ${spacing.xxsmall};
  padding-bottom: ${spacing.small};
`;

const StyledLi = styled.li`
  margin-bottom: unset;
`;

const StyledHeading = styled.span`
  font-weight: ${fonts.weight.bold};
  ${fonts.sizes('22px', '30px')};
`;

const TimeSince = styled.span`
  ${fonts.sizes('16px', '26px')};
`;

const NotificationTitle = styled.span`
  ${fonts.sizes('18px', '24px')};
  font-weight: ${fonts.weight.semibold};
  text-align: left;
`;

const StyledKeyboardReturn = styled(KeyboardReturn)`
  transform: scaleY(-1);
  min-width: ${spacing.normal};
  min-height: ${spacing.normal};
`;

const Locales = {
  nn: nn,
  nb: nb,
  en: enGB,
  se: nb,
};

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const toArenaTopic = (tid: number) => `/${tid}`;
const toArenaPost = (tid: number, pid: number) =>
  `/${toArenaTopic(tid)}/${pid}`;
interface Props {
  notifications?: GQLArenaNotificationFragmentFragment[];
  isButton?: boolean;
}

const NotificationList = ({ notifications, isButton }: Props) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const now = useMemo(() => new Date(), []);
  const { markNotificationRead } = useMarkNotificationsAsRead();

  const markAllRead = useCallback(async () => {
    await Promise.all(
      notifications
        ?.filter(({ read }) => !read)
        ?.map(({ tid }) => {
          markNotificationRead({ variables: { topicId: tid } });
        }) ?? [],
    );
  }, [notifications]);

  const notifcationsToShow = useMemo(
    () => (!!isButton ? notifications?.slice(0, 5) : notifications),
    [notifications, isButton],
  );

  return (
    <>
      <TitleWrapper>
        <StyledHeading>{t('myNdla.arena.notification.title')}</StyledHeading>
        <ButtonV2 variant="link" fontWeight="light" onClick={markAllRead}>
          {t('myNdla.arena.notification.markAll')}
        </ButtonV2>
      </TitleWrapper>
      <StyledList>
        {notifcationsToShow?.map(
          ({ tid, pid, read, user, datetimeISO, topicTitle }, index) => (
            <StyledLi key={index}>
              <StyledLink
                to={toArenaPost(tid, pid)}
                variant="stripped"
                data-not-viewed={!read}
              >
                <Notification>
                  <StyledKeyboardReturn />
                  <div>
                    <NotificationTitle>
                      {`${user.displayName} 
                        ${t('myNdla.arena.notification.commentedOn')} `}
                      <em>{topicTitle}</em>
                    </NotificationTitle>
                    <TimeSince>
                      {`${capitalizeFirstLetter('Frank')}
                    ${formatDistanceStrict(Date.parse(datetimeISO), now, {
                      addSuffix: true,
                      locale: Locales[language],
                      roundingMethod: 'floor',
                    })}`}
                    </TimeSince>
                  </div>
                </Notification>
                {!read && <StyledDot />}
              </StyledLink>
            </StyledLi>
          ),
        )}
      </StyledList>
    </>
  );
};

export default NotificationList;
