/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  BookReadFill,
  BookReadLine,
  RobotFill,
  MovieLine,
  ForumOutlined,
  HomeFill,
  HomeLine,
  LogoutBoxRightLine,
  UserFill,
  UserLine,
  LoginBoxLine,
  RouteLine,
  RouteFill,
  FolderFill,
  FolderLine,
  MenuLine,
} from "@ndla/icons";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  IconButton,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { getCookie, NoSSR } from "@ndla/util";
import { TFunction } from "i18next";
import { useMemo, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Location, Outlet, useLocation } from "react-router";
import { AuthContext } from "../../components/AuthenticationContext";
import { DialogCloseButton } from "../../components/DialogCloseButton";
import { PageLayout } from "../../components/Layout/PageContainer";
import config from "../../config";
import { AUTOLOGIN_COOKIE, FILM_PAGE_URL } from "../../constants";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getChatRobotUrl } from "../../util/chatRobotHelpers";
import { toHref } from "../../util/urlHelper";
import { MenuContainer, MenuLink, MenuList, MenuListItem } from "./components/MenuContainer";

const StyledIconButton = styled(IconButton, {
  base: {
    width: "fit-content",
    tablet: {
      display: "none",
    },
  },
});

const StyledLayout = styled(PageLayout, {
  base: {
    background: "background.strong",
    paddingBlockEnd: "5xlarge",
  },
});

const GridLayout = styled("div", {
  base: {
    display: "grid",
    maxWidth: "surface.wideMax",
    gap: "medium",
    padding: "small",
    gridTemplateColumns: "none",
    transitionProperty: "gap",
    transitionDuration: "fast",
    transitionTimingFunction: "default",
    tablet: {
      padding: "medium",
      gridTemplateColumns: "max-content minmax(0, 1fr)",
    },
    desktop: {
      gap: "xlarge",
    },
    wide: {
      gap: "3xlarge",
    },
  },
});

const StyledMenuContainer = styled(MenuContainer, {
  base: {
    tabletDown: {
      display: "none",
    },
  },
});

export const Component = () => {
  return (
    <NoSSR fallback={null}>
      <MyNdlaLayout />
    </NoSSR>
  );
};

const StyledDialogContent = styled(DialogContent, {
  base: {
    background: "background.subtle",
  },
});

const loginlocation = `/login?returnTo=${routes.myNdla.root}`;

export const MyNdlaLayout = () => {
  const { t } = useTranslation();
  const { examLock, authenticated, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (!authContextLoaded || authenticated || !window.location) return;
    const autologin = getCookie(AUTOLOGIN_COOKIE, document.cookie);
    // If in browser, cookie exists due to previous login, and user is not logged in now, redirect user to feide
    if (autologin) {
      window.location.replace(loginlocation);
    }
  }, [authenticated, authContextLoaded]);

  return (
    <StyledLayout>
      <GridLayout>
        <MyNdlaMenu />
        <div>
          {!!examLock && (
            <MessageBox variant="warning">
              <Text>{t("myNdla.examLockInfo")}</Text>
            </MessageBox>
          )}
          <Outlet />
        </div>
      </GridLayout>
    </StyledLayout>
  );
};

const MyNdlaMenu = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const linkElements = useMemo(() => menuLinks(t, location, user), [location, t, user]);

  return (
    <>
      <StyledMenuContainer asChild consumeCss>
        <nav aria-label={t("myNdla.myNDLAMenu")}>
          <MenuList data-testid="my-ndla-menu">
            {linkElements.map((link) => (
              <MenuListItem key={link.id} link={link} context="desktop" />
            ))}
          </MenuList>
        </nav>
      </StyledMenuContainer>
      <DialogRoot key={location.pathname}>
        <DialogTrigger asChild>
          <StyledIconButton variant="tertiary" aria-label={t("myNdla.iconMenu.more")} title={t("myNdla.iconMenu.more")}>
            <MenuLine />
          </StyledIconButton>
        </DialogTrigger>
        <StyledDialogContent>
          <DialogHeader>
            <DialogCloseButton />
            <DialogTitle textStyle="title.medium" srOnly>
              {t("myNdla.myNDLA")}
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <MenuContainer>
              <nav aria-label={t("myNdla.myNDLAMenu")}>
                <MenuList>
                  {linkElements.map((link) => (
                    <MenuListItem key={link.id} link={link} context="handheld" />
                  ))}
                </MenuList>
              </nav>
            </MenuContainer>
          </DialogBody>
        </StyledDialogContent>
      </DialogRoot>
    </>
  );
};

const menuLinks = (
  t: TFunction,
  location: Location,
  user: GQLMyNdlaPersonalDataFragmentFragment | undefined,
): MenuLink[] => [
  {
    id: "root",
    to: routes.myNdla.root,
    name: t("myNdla.myNDLA"),
    shortName: t("myNdla.myNDLA"),
    icon: <HomeLine />,
    iconFilled: <HomeFill />,
  },
  {
    id: "folders",
    to: routes.myNdla.folders,
    name: t("myNdla.myFolders"),
    shortName: t("myNdla.iconMenu.folders"),
    icon: <FolderLine />,
    iconFilled: <FolderFill />,
  },
  {
    id: "subjects",
    to: routes.myNdla.subjects,
    name: t("myNdla.favoriteSubjects.title"),
    shortName: t("myNdla.iconMenu.subjects"),
    icon: <BookReadLine />,
    iconFilled: <BookReadFill />,
  },
  {
    id: "learningpaths",
    to: routes.myNdla.learningpath,
    name: t("myNdla.learningpath.title"),
    shortName: t("myNdla.iconMenu.learningpath"),
    icon: <RouteLine />,
    iconFilled: <RouteFill />,
    hiddenForUser: user?.role !== "employee",
  },
  {
    id: "arena",
    to: `https://${config.arenaDomain}`,
    name: t("welcomePage.quickLinks.arena.title"),
    shortName: t("welcomePage.quickLinks.arena.title"),
    icon: <ForumOutlined />,
    showSeparator: true,
  },
  {
    id: "robot",
    to: `${getChatRobotUrl(user)}`,
    name: t("welcomePage.quickLinks.chatRobot.title"),
    shortName: t("welcomePage.quickLinks.chatRobot.title"),
    icon: <RobotFill />,
  },
  {
    id: "film",
    to: `${FILM_PAGE_URL}`,
    name: t("welcomePage.quickLinks.film.title"),
    shortName: t("welcomePage.quickLinks.film.title"),
    icon: <MovieLine />,
  },
  {
    id: "profile",
    to: routes.myNdla.profile,
    name: t("myNdla.myProfile.title"),
    shortName: t("myNdla.iconMenu.profile"),
    icon: <UserLine />,
    iconFilled: <UserFill />,
    showSeparator: true,
  },
  {
    id: "logout-path",
    name: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    shortName: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    icon: user ? <LogoutBoxRightLine /> : <LoginBoxLine />,
    to: user ? `/logout?returnTo=${toHref(location)}` : `/login?returnTo=${toHref(location)}`,
    reloadDocument: true,
  },
];
