/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { CircleFill, CornerDownLeftLine } from "@ndla/icons/common";
import { Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { GQLArenaNotificationV2Fragment } from "../../../graphqlTypes";
import { routes } from "../../../routeHelpers";
import { formatDistanceToNow } from "../../../util/formatDate";
import { capitalizeFirstLetter } from "../Arena/utils";

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    display: "flex",
    justifyContent: "space-between",
    paddingBlock: "xsmall",
    paddingInline: "xsmall",
    boxShadowColor: "stroke.subtle",
    gap: "xsmall",
  },
  variants: {
    unread: {
      true: {
        background: "surface.actionSubtle.active",
      },
    },
  },
});

const Notification = styled("div", {
  base: {
    alignItems: "center",
    display: "flex",
    justifyContent: "flex-start",
    gap: "xsmall",
    textAlign: "start",
  },
});

const StyledList = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
    listStyle: "none",
  },
});

const StyledKeyboardReturn = styled(CornerDownLeftLine, {
  base: {
    transform: "scaleY(-1)",
    color: "icon.default",
  },
});

const TextWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "4xsmall",
  },
});

interface Props {
  notifications?: GQLArenaNotificationV2Fragment[];
  close?: VoidFunction;
}

const NotificationList = ({ notifications, close }: Props) => {
  const { t } = useTranslation();
  const now = new Date();

  const notifcationsToShow = useMemo(
    () => (close ? notifications?.slice(0, 5) : notifications),
    [notifications, close],
  );

  return (
    <StyledList>
      {notifcationsToShow?.map((notification, index) => (
        <li key={index}>
          <StyledSafeLinkButton
            variant="secondary"
            to={routes.myNdla.arenaTopic(notification.topicId)}
            onClick={() => close?.()}
            unread={!notification.isRead}
          >
            <Notification>
              <StyledKeyboardReturn />
              <TextWrapper>
                <Text textStyle="label.large" fontWeight="bold" color="text.default">
                  {`${notification.post?.owner?.displayName ?? t("user.deletedUser")} `}
                  <Trans
                    i18nKey={"myNdla.arena.notification.commentedOn"}
                    tOptions={{ title: notification.topicTitle }}
                    t={t}
                  />
                </Text>
                <Text color="text.default">
                  {`${capitalizeFirstLetter(formatDistanceToNow(notification.notificationTime, t, now))}`}
                </Text>
              </TextWrapper>
            </Notification>
            {!notification.isRead && <CircleFill size="small" />}
          </StyledSafeLinkButton>
        </li>
      ))}
    </StyledList>
  );
};

export default NotificationList;
