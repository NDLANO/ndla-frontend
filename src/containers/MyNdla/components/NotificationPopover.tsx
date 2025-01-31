/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Heading, PopoverContent, PopoverRoot, PopoverTitle, PopoverTrigger } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import NotificationBellButton from "./NotificationButton";
import NotificationList from "./NotificationList";
import config from "../../../config";
import { routes } from "../../../routeHelpers";
import {
  useArenaMarkNotificationsAsRead,
  useTemporaryArenaNotifications,
} from "../Arena/components/temporaryNodebbHooks";

const StyledPopoverContent = styled(PopoverContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    maxWidth: "surface.medium",
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "xsmall",
    paddingBlockEnd: "4xsmall",
  },
});

const NotificationPopover = () => {
  const { notifications } = useTemporaryArenaNotifications(config.externalArena);
  const { markNotificationsAsRead } = useArenaMarkNotificationsAsRead();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const markAllRead = useCallback(async () => {
    const topicIdsToBeMarkedRead =
      notifications?.items.filter(({ isRead }) => !isRead)?.map(({ topicId }) => topicId) ?? [];

    await markNotificationsAsRead({
      variables: { topicIds: topicIdsToBeMarkedRead },
    });
  }, [notifications, markNotificationsAsRead]);

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild>
        <NotificationBellButton notifications={notifications?.items} />
      </PopoverTrigger>
      <StyledPopoverContent>
        <TitleWrapper>
          <Heading asChild consumeCss textStyle="title.medium">
            <PopoverTitle>{t("myNdla.arena.notification.title")}</PopoverTitle>
          </Heading>
          <Button variant="link" size="small" onClick={markAllRead}>
            {t("myNdla.arena.notification.markAll")}
          </Button>
        </TitleWrapper>
        <NotificationList notifications={notifications?.items} close={() => setOpen(false)} />
        <SafeLinkButton to={routes.myNdla.notifications} onClick={() => setOpen(false)}>
          {t("myNdla.arena.notification.showAll")}
        </SafeLinkButton>
      </StyledPopoverContent>
    </PopoverRoot>
  );
};

export default NotificationPopover;
