/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { formatDistanceStrict } from "date-fns";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing, colors, fonts } from "@ndla/core";
import { CircleFill, CornerDownLeftLine } from "@ndla/icons/common";
import { Button } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { Heading, Text } from "@ndla/typography";
import { GQLArenaNotificationV2Fragment } from "../../../graphqlTypes";
import { DateFNSLocales } from "../../../i18n";
import { routes } from "../../../routeHelpers";
import { useArenaMarkNotificationsAsRead } from "../Arena/components/temporaryNodebbHooks";
import { capitalizeFirstLetter } from "../Arena/utils";

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: ${spacing.normal};
  padding-top: ${spacing.large};

  &[data-popover="true"] {
    padding-top: unset;
  }
`;

const StyledDot = styled(CircleFill)`
  width: ${spacing.small};
  height: ${spacing.small};
  color: ${colors.brand.primary};
`;

const StyledLink = styled(SafeLinkButton)`
  display: flex;
  justify-content: space-between;

  &[data-not-viewed="true"] {
    background-color: ${colors.background.lightBlue};
    border: solid 1px ${colors.brand.secondary};
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
  display: flex;
  flex-direction: column;
  padding: 0 0 ${spacing.small} 0;
`;

const StyledLi = styled.li`
  padding: 0;
`;

const StyledText = styled(Text)`
  font-weight: ${fonts.weight.semibold};
`;

const StyledKeyboardReturn = styled(CornerDownLeftLine)`
  transform: scaleY(-1);
  min-width: ${spacing.normal};
  min-height: ${spacing.normal};
`;

interface Props {
  notifications?: GQLArenaNotificationV2Fragment[];
  close?: VoidFunction;
}

const NotificationList = ({ notifications, close }: Props) => {
  const { markNotificationsAsRead } = useArenaMarkNotificationsAsRead();
  const { t, i18n } = useTranslation();
  const now = new Date();

  const markAllRead = useCallback(async () => {
    const topicIdsToBeMarkedRead = notifications?.filter(({ isRead }) => !isRead)?.map(({ topicId }) => topicId) ?? [];

    await markNotificationsAsRead({
      variables: { topicIds: topicIdsToBeMarkedRead },
    });
  }, [notifications, markNotificationsAsRead]);

  const notifcationsToShow = useMemo(
    () => (close ? notifications?.slice(0, 5) : notifications),
    [notifications, close],
  );

  return (
    <>
      <TitleWrapper data-popover={!!close}>
        {close ? (
          <Heading element="h4" headingStyle="h4" margin="none">
            {t("myNdla.arena.notification.title")}
          </Heading>
        ) : (
          <Heading element="h2" headingStyle="list-title" margin="none">
            {t("myNdla.arena.notification.title")}
          </Heading>
        )}
        {/* TODO: Check if we should include an option for link variant to remove all padding */}
        <Button variant="link" onClick={markAllRead}>
          {t("myNdla.arena.notification.markAll")}
        </Button>
      </TitleWrapper>
      <StyledList>
        {notifcationsToShow?.map((notification, index) => {
          return (
            <StyledLi key={index}>
              <StyledLink
                variant="secondary"
                data-not-viewed={!notification.isRead}
                to={routes.myNdla.arenaTopic(notification.topicId)}
                onClick={() => close?.()}
              >
                <Notification>
                  <StyledKeyboardReturn />
                  <div>
                    <StyledText textStyle="meta-text-medium" margin="none">
                      {`${notification.post?.owner?.displayName ?? t("user.deletedUser")} `}
                      <Trans
                        i18nKey={"myNdla.arena.notification.commentedOn"}
                        tOptions={{ title: notification.topicTitle }}
                        t={t}
                      />
                    </StyledText>
                    <Text textStyle="meta-text-small" margin="none">
                      {`${capitalizeFirstLetter(
                        formatDistanceStrict(Date.parse(notification.notificationTime), now, {
                          addSuffix: true,
                          locale: DateFNSLocales[i18n.language],
                          roundingMethod: "floor",
                        }),
                      )}`}
                    </Text>
                  </div>
                </Notification>
                {!notification.isRead && <StyledDot />}
              </StyledLink>
            </StyledLi>
          );
        })}
      </StyledList>
    </>
  );
};

export default NotificationList;
