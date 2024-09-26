/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { forwardRef, useMemo, ComponentPropsWithRef } from "react";
import { useTranslation } from "react-i18next";
import { NotificationLine } from "@ndla/icons/common";
import { Button, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLArenaNotificationV2Fragment } from "../../../graphqlTypes";

const NotificationCounter = styled(Text, {
  base: {
    position: "absolute",
    background: "surface.danger",
    paddingInline: "3xsmall",
    paddingBlock: "1",
    borderRadius: "2px",
    bottom: "40%",
    "&[data-left='true']": {
      right: "50%",
    },
    "&[data-left='false']": {
      left: "50%",
    },
  },
});

const IconWrapper = styled("div", {
  base: {
    position: "relative",
  },
});

interface Props extends ComponentPropsWithRef<"button"> {
  notifications?: GQLArenaNotificationV2Fragment[];
}

const NotificationBellButton = forwardRef<HTMLButtonElement, Props>(({ notifications, ...rest }, ref) => {
  const { t } = useTranslation();
  const newNotifications = useMemo(() => notifications?.filter(({ isRead }) => !isRead).length, [notifications]);

  return (
    <Button
      variant="tertiary"
      ref={ref}
      aria-label={
        newNotifications
          ? t("myNdla.arena.notification.button.showNew", { count: newNotifications })
          : t("myNdla.arena.notification.button.show")
      }
      size="small"
      {...rest}
    >
      {t("myNdla.arena.notification.title")}
      <BellIcon amountOfUnreadNotifications={newNotifications ?? 0} />
    </Button>
  );
});

export default NotificationBellButton;
interface BellIconProps {
  amountOfUnreadNotifications: number;
  left?: boolean;
}

export const BellIcon = ({ amountOfUnreadNotifications, left }: BellIconProps) => {
  return (
    <IconWrapper>
      <NotificationLine size="small" />
      {amountOfUnreadNotifications !== 0 && (
        <NotificationCounter textStyle="label.xsmall" color="text.onAction" data-left={!!left} asChild consumeCss>
          <div>{amountOfUnreadNotifications > 99 ? "99+" : amountOfUnreadNotifications}</div>
        </NotificationCounter>
      )}
    </IconWrapper>
  );
};
