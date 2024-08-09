/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useOutletContext } from "react-router-dom";
import { Portal } from "@ark-ui/react";
import { MenuLine } from "@ndla/icons/action";
import { ListCheck } from "@ndla/icons/editor";
import { Button, DialogBody, DialogContent, DialogHeader, DialogTitle, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import NavigationLink from "./NavigationLink";
import { BellIcon } from "./NotificationButton";
import { AuthContext } from "../../../components/AuthenticationContext";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { routes } from "../../../routeHelpers";
import { useTemporaryArenaNotifications } from "../Arena/components/temporaryNodebbHooks";
import { ViewType } from "../Folders/FoldersPage";
import { OutletContext, menuLinks } from "../MyNdlaLayout";

const StyledText = styled(Text, {
  base: {
    paddingInlineStart: "xsmall",
    textTransform: "uppercase",
  },
});

const MenuItems = styled("ul", {
  base: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(auto, 1fr))",
    justifyContent: "space-between",
    paddingBlockEnd: "xsmall",
    borderBottom: "1px solid",
    borderColor: "surface.brand.2.moderate",
    background: "surface.brand.2.subtle",
  },
});

const ToolMenu = styled("ul", {
  base: {
    listStyle: "none",
    "& > li": {
      display: "flex",
      flexDirection: "column",
    },
    "& li": {
      borderTop: "1px solid",
      borderColor: "surface.brand.2.moderate",
      _last: {
        borderBottom: "1px solid",
        borderColor: "surface.brand.2.moderate",
      },
    },
  },
});

const ViewButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "4xsmall",
    paddingInlineStart: "xsmall",
  },
});

const ViewButton = styled(Button, {
  base: {
    display: "flex",
    justifyContent: "flex-start",
    flexDirection: "column",
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    paddingBlockStart: "0",
    paddingInline: "0",
  },
});

const StyledDialogHeader = styled(DialogHeader, {
  base: {
    background: "surface.brand.2.subtle",
  },
});

interface Props {
  onViewTypeChange?: (val: ViewType) => void;
  viewType?: ViewType;
  buttons?: ReactNode;
  showButtons?: boolean;
}

const MenuModalContent = ({ onViewTypeChange, viewType, buttons, showButtons = true }: Props) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { setIsOpen, resetFocus, setResetFocus } = useOutletContext<OutletContext>();
  const { user } = useContext(AuthContext);
  const { notifications } = useTemporaryArenaNotifications(!user?.arenaEnabled);
  const links = useMemo(
    () =>
      menuLinks(t, location, user).map(({ id, shortName, icon, to, name, iconFilled, shownForUser }) => {
        if (shownForUser && !shownForUser(user)) {
          return null;
        }
        return (
          <li key={id}>
            <NavigationLink
              id={id}
              to={to}
              name={name}
              icon={icon}
              shortName={shortName}
              iconFilled={iconFilled}
              onClick={() => setIsOpen(false)}
            />
          </li>
        );
      }),
    [t, location, user, setIsOpen],
  );

  const notificationLink = useMemo(
    () => (
      <li>
        <SafeLinkButton variant="tertiary" to={routes.myNdla.notifications} onClick={() => setIsOpen(false)}>
          <BellIcon
            amountOfUnreadNotifications={notifications?.items?.filter(({ isRead }) => !isRead).length ?? 0}
            left={true}
          />
          {t("myNdla.arena.notification.title")}
        </SafeLinkButton>
      </li>
    ),
    [notifications, setIsOpen, t],
  );

  const onCloseModal = useCallback(
    (e: Event) => {
      if (resetFocus) {
        e.preventDefault();
        setResetFocus(false);
      }
    },
    [resetFocus, setResetFocus],
  );

  return (
    // TODO: There used to be a onCloseAutoFocus here. It called onCloseModal
    <Portal>
      <DialogContent>
        <StyledDialogHeader>
          <DialogTitle textStyle="title.medium">{t("myNdla.myNDLA")}</DialogTitle>
          <DialogCloseButton />
        </StyledDialogHeader>
        <StyledDialogBody>
          <nav aria-label={t("myNdla.myNDLAMenu")}>
            <MenuItems role="tablist">{links}</MenuItems>
          </nav>
          {showButtons && (!!buttons || user?.arenaEnabled) && (
            <>
              <StyledText textStyle="title.medium">{t("myNdla.tools")}</StyledText>
              <ToolMenu>
                {buttons}
                {user?.arenaEnabled && notificationLink}
              </ToolMenu>
            </>
          )}
          {!!viewType && (
            <>
              <StyledText textStyle="title.medium">{t("myNdla.selectView")}</StyledText>
              <ViewButtonWrapper>
                <ViewButton
                  // TODO: Fix handling of active according to design
                  variant={viewType === "list" ? "primary" : "secondary"}
                  aria-label={t("myNdla.listView")}
                  aria-current={viewType === "list"}
                  onClick={() => onViewTypeChange?.("list")}
                >
                  <MenuLine />
                  <Text textStyle="label.xsmall">{t("myNdla.simpleList")}</Text>
                </ViewButton>
                <ViewButton
                  // TODO: Fix handling of active according to design
                  variant={viewType === "listLarger" ? "primary" : "secondary"}
                  aria-label={t("myNdla.detailView")}
                  aria-current={viewType === "listLarger"}
                  onClick={() => onViewTypeChange?.("listLarger")}
                >
                  <ListCheck />
                  <Text textStyle="label.xsmall">{t("myNdla.detailedList")}</Text>
                </ViewButton>
              </ViewButtonWrapper>
            </>
          )}
        </StyledDialogBody>
      </DialogContent>
    </Portal>
  );
};

export default MenuModalContent;
