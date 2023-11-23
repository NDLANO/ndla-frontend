import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing, colors, fonts } from '@ndla/core';
import { HelpCircleDual, KeyboardReturn } from '@ndla/icons/common';
import { SafeLinkButton } from '@ndla/safelink';
import { Text } from '@ndla/typography';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { formatDistanceStrict } from 'date-fns';
import { nb, nn, enGB } from 'date-fns/locale';
import { GQLArenaNotificationFragmentFragment } from '../../../graphqlTypes';
import { useMarkNotificationsAsRead } from '../arenaQueries';

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.normal};
  gap: minmax(150px, auto);
`;

const StyledDot = styled(HelpCircleDual)`
  width: ${spacing.small};
  height: ${spacing.small};
  color: ${colors.brand.primary};
`;

const StyledLink = styled(SafeLinkButton)`
  display: flex;
  border: solid 1px ${colors.brand.greyLight};
  border-radius: ${spacing.xxsmall};
  justify-content: space-between;
  padding: ${spacing.small} ${spacing.normal};
  gap: ${spacing.small};

  &:hover {
    background-color: ${colors.brand.lighter};
    border: solid 1px ${colors.brand.light};
    color: ${colors.text.primary};
  }

  &[data-not-viewed='true'] {
    background-color: ${colors.brand.lightest};
    border: solid 1px ${colors.brand.lighter};
  }

  &[data-popover='true'] {
    padding: ${spacing.small};
  }
`;

const Notification = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${spacing.small};
  text-align: start;
`;

const StyledList = styled.ul`
  list-style: none;
  gap: ${spacing.xxsmall};
  padding: 0 0 ${spacing.small} 0;
`;

const StyledLi = styled.li`
  margin-bottom: ${spacing.xxsmall};
`;

const StyledText = styled(Text)`
  font-weight: ${fonts.weight.semibold};
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

const toArenaTopic = (topicId: number) => `/minndla/arena/topic/${topicId}`;

interface Props {
  notifications?: GQLArenaNotificationFragmentFragment[];
  inPopover?: boolean;
}

const NotificationList = ({ notifications, inPopover }: Props) => {
  const { markNotificationsAsRead } = useMarkNotificationsAsRead();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const now = useMemo(() => new Date(), []);

  const markAllRead = useCallback(async () => {
    const topicIdsToBeMarkedRead =
      notifications
        ?.filter(({ read }) => !read)
        ?.map(({ topicId }) => topicId) ?? [];

    await markNotificationsAsRead({
      variables: { topicIds: topicIdsToBeMarkedRead },
    });
  }, [notifications, markNotificationsAsRead]);

  const notifcationsToShow = useMemo(
    () => (inPopover ? notifications?.slice(0, 5) : notifications),
    [notifications, inPopover],
  );

  return (
    <>
      <TitleWrapper>
        <Text textStyle="meta-text-large" margin="none">
          {t('myNdla.arena.notification.title')}
        </Text>
        <ButtonV2 variant="link" fontWeight="light" onClick={markAllRead}>
          {t('myNdla.arena.notification.markAll')}
        </ButtonV2>
      </TitleWrapper>
      <StyledList>
        {notifcationsToShow?.map(
          ({ topicId, read, user, datetimeISO, topicTitle }, index) => (
            <StyledLi key={index}>
              <StyledLink
                variant="stripped"
                data-not-viewed={!read}
                data-popover={inPopover}
                to={toArenaTopic(topicId)}
              >
                <Notification>
                  <StyledKeyboardReturn />
                  <div>
                    <StyledText textStyle="meta-text-medium" margin="none">
                      {`${user.displayName}`}
                      {` ${t('myNdla.arena.notification.commentedOn')} `}
                      <i>{topicTitle.replace(/"/g, '')}</i>
                    </StyledText>
                    <Text textStyle="meta-text-small" margin="none">
                      {`${capitalizeFirstLetter(
                        formatDistanceStrict(Date.parse(datetimeISO), now, {
                          addSuffix: true,
                          locale: Locales[language],
                          roundingMethod: 'floor',
                        }),
                      )}`}
                    </Text>
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
