/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import NotificationBellButton from "./NotificationButton";
import NotificationList from "./NotificationList";
import { routes } from "../../../routeHelpers";
import { useTemporaryArenaNotifications } from "../Arena/components/temporaryNodebbHooks";

const ShowAllLink = styled(SafeLinkButton)`
  margin-top: ${spacing.small};
  width: 100%;
`;

const NotificationPopover = () => {
  const { notifications } = useTemporaryArenaNotifications();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <PopoverRoot open={open} onOpenChange={(details) => setOpen(details.open)}>
      <PopoverTrigger asChild>
        <NotificationBellButton notifications={notifications?.items} />
      </PopoverTrigger>
      <PopoverContent>
        <NotificationList notifications={notifications?.items} close={() => setOpen(false)} />
        <ShowAllLink to={routes.myNdla.notifications} onClick={() => setOpen(false)}>
          {t("myNdla.arena.notification.showAll")}
        </ShowAllLink>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default NotificationPopover;
