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
import { CircleFill, CornerDownLeftLine } from "@ndla/icons/common";
import { Button, Heading, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { GQLArenaNotificationV2Fragment } from "../../../graphqlTypes";
import { DateFNSLocales } from "../../../i18n";
import { routes } from "../../../routeHelpers";
import { useArenaMarkNotificationsAsRead } from "../Arena/components/temporaryNodebbHooks";
import { capitalizeFirstLetter } from "../Arena/utils";

const TitleWrapper = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",

    "&[data-popover='true']": {
      paddingBlockStart: "unset",
    },
  },
});

const StyledLink = styled(SafeLinkButton, {
  base: {
    display: "flex",
    justifyContent: "space-between",

    "&[data-no-viewed='true']": {
      backgroundColor: "surface.actionSubtle",
      border: "1px solid",
      borderColor: "surface.brand.1.strong",
    },
  },
});

const Notification = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-start",
    gap: "xxsmall",
    textAlign: "start",
  },
});

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    listStyle: "none",
    paddingBlockEnd: "xxsmall",
  },
});

const StyledLi = styled("li", {
  base: { padding: "0" },
});

const StyledKeyboardReturn = styled(CornerDownLeftLine, {
  base: {
    transform: "scaleY(-1)",
  },
});

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
          <Heading textStyle="title.medium" asChild consumeCss>
            <h4>{t("myNdla.arena.notification.title")}</h4>
          </Heading>
        ) : (
          <Heading textStyle="title.small" asChild consumeCss>
            <h2>{t("myNdla.arena.notification.title")}</h2>
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
                    <Text textStyle="title.small">
                      {`${notification.post?.owner?.displayName ?? t("user.deletedUser")} `}
                      <Trans
                        i18nKey={"myNdla.arena.notification.commentedOn"}
                        tOptions={{ title: notification.topicTitle }}
                        t={t}
                      />
                    </Text>
                    <Text textStyle="body.small">
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
                {!notification.isRead && <CircleFill color="stroke.default" />}
              </StyledLink>
            </StyledLi>
          );
        })}
      </StyledList>
    </>
  );
};

export default NotificationList;
