/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { useArenaMarkNotificationsAsRead, useTemporaryArenaNotifications } from "./components/temporaryNodebbHooks";
import config from "../../../config";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import NotificationList from "../components/NotificationList";

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
});

const StyledMyNdlaPageWrapper = styled(MyNdlaPageWrapper, {
  base: {
    gap: "medium",
  },
});

const ArenaNotificationPage = () => {
  const { t } = useTranslation();
  const { notifications } = useTemporaryArenaNotifications(config.externalArena);
  const { markNotificationsAsRead } = useArenaMarkNotificationsAsRead();

  const markAllRead = useCallback(async () => {
    const topicIdsToBeMarkedRead =
      notifications?.items.filter(({ isRead }) => !isRead)?.map(({ topicId }) => topicId) ?? [];

    await markNotificationsAsRead({
      variables: { topicIds: topicIdsToBeMarkedRead },
    });
  }, [notifications, markNotificationsAsRead]);

  return (
    <StyledMyNdlaPageWrapper>
      <HelmetWithTracker title={t("myNdla.arena.notification.myNotification")} />
      <MyNdlaBreadcrumb
        breadcrumbs={[
          {
            id: "notification",
            name: t("myNdla.arena.notification.myNotification"),
          },
        ]}
        page="arena"
      />
      <TitleWrapper>
        <MyNdlaTitle title={t("myNdla.arena.notification.myNotification")} />
        <Button variant="link" size="small" onClick={markAllRead}>
          {t("myNdla.arena.notification.markAll")}
        </Button>
      </TitleWrapper>
      <NotificationList notifications={notifications?.items} />
    </StyledMyNdlaPageWrapper>
  );
};

export default ArenaNotificationPage;
