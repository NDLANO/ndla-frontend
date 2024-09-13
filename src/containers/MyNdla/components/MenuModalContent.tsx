/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Portal, useDialogContext } from "@ark-ui/react";
import { DialogBody, DialogContent, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import NavigationLink from "./NavigationLink";
import { BellIcon } from "./NotificationButton";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { routes } from "../../../routeHelpers";
import { useTemporaryArenaNotifications } from "../Arena/components/temporaryNodebbHooks";
import { menuLinks } from "../MyNdlaLayout";

const MenuItems = styled("ul", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(auto, 1fr))",
    gap: "4xsmall",
    justifyContent: "space-between",
  },
});

const ToolMenu = styled("ul", {
  base: {
    listStyle: "none",
    "& > li": {
      display: "flex",
      flexDirection: "column",
      "& a, button": {
        justifyContent: "flex-start",
      },
    },
  },
});

const StyledDialogHeader = styled(DialogHeader, {
  base: {
    background: "background.subtle",
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    height: "100%",
    paddingInline: "0",
    paddingBlock: "0",
  },
});

const ContentWrapper = styled("div", {
  base: {
    paddingInline: "medium",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledNav = styled("nav", {
  base: {
    paddingBlock: "small",
    background: "background.subtle",
    paddingInline: "xsmall",
  },
});

interface Props {
  buttons?: ReactNode;
  showButtons?: boolean;
}

const MenuModalContent = ({ buttons, showButtons = true }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setOpen } = useDialogContext();
  const { user } = useContext(AuthContext);
  const { notifications } = useTemporaryArenaNotifications(!user?.arenaEnabled);
  const links = useMemo(
    () =>
      menuLinks(t, location, user).map(
        ({ id, shortName, icon, to, name, iconFilled, shownForUser, reloadDocument }) => {
          if (shownForUser && !shownForUser(user)) {
            return null;
          }
          return (
            <li key={id}>
              <NavigationLink
                to={to}
                name={name}
                icon={icon}
                shortName={shortName}
                iconFilled={iconFilled}
                reloadDocument={reloadDocument}
                onClick={() => setOpen(false)}
              />
            </li>
          );
        },
      ),
    [t, location, user, setOpen],
  );

  const notificationLink = useMemo(
    () => (
      <li>
        <SafeLinkButton variant="tertiary" to={routes.myNdla.notifications} onClick={() => setOpen(false)}>
          <BellIcon
            amountOfUnreadNotifications={notifications?.items?.filter(({ isRead }) => !isRead).length ?? 0}
            left={true}
          />
          {t("myNdla.arena.notification.title")}
        </SafeLinkButton>
      </li>
    ),
    [notifications?.items, setOpen, t],
  );

  return (
    <Portal>
      <DialogContent>
        <StyledDialogHeader>
          <DialogTitle textStyle="title.medium">{t("myNdla.myNDLA")}</DialogTitle>
          <DialogCloseButton />
        </StyledDialogHeader>
        <StyledDialogBody>
          <StyledNav aria-label={t("myNdla.myNDLAMenu")}>
            <MenuItems role="tablist">{links}</MenuItems>
          </StyledNav>
          <ContentWrapper>
            {showButtons && (!!buttons || user?.arenaEnabled) && (
              <>
                <Text textStyle="label.medium" fontWeight="bold">
                  {t("myNdla.tools")}
                </Text>
                <ToolMenu>
                  {buttons}
                  {user?.arenaEnabled && notificationLink}
                </ToolMenu>
              </>
            )}
          </ContentWrapper>
        </StyledDialogBody>
      </DialogContent>
    </Portal>
  );
};

export default MenuModalContent;
