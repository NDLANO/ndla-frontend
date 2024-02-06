/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { HelmetWithTracker } from "@ndla/tracker";
import { useTemporaryArenaNotifications } from "./components/temporaryNodebbHooks";
import MyNdlaBreadcrumb from "../components/MyNdlaBreadcrumb";
import MyNdlaPageWrapper from "../components/MyNdlaPageWrapper";
import MyNdlaTitle from "../components/MyNdlaTitle";
import NotificationList from "../components/NotificationList";
import TitleWrapper from "../components/TitleWrapper";

const ArenaNotificationPage = () => {
  const { t } = useTranslation();
  const { notifications } = useTemporaryArenaNotifications();
  return (
    <MyNdlaPageWrapper>
      <HelmetWithTracker title={t("myNdla.arena.notification.myNotification")} />
      <TitleWrapper>
        <MyNdlaBreadcrumb
          breadcrumbs={[
            {
              id: "notification",
              name: t("myNdla.arena.notification.myNotification"),
            },
          ]}
          page="arena"
        />
        <MyNdlaTitle title={t("myNdla.arena.notification.myNotification")} />
      </TitleWrapper>
      <NotificationList notifications={notifications?.items} />
    </MyNdlaPageWrapper>
  );
};

export default ArenaNotificationPage;
