/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useMemo, useContext, useEffect, useState, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Location, Outlet, useLocation } from "react-router";
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
  MoreLine,
  FolderFill,
  FolderLine,
} from "@ndla/icons";
import { DialogRoot, DialogTrigger, MessageBox, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { getCookie, NoSSR } from "@ndla/util";
import NavigationLink, { MoreButton } from "./components/NavigationLink";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageLayout } from "../../components/Layout/PageContainer";
import config from "../../config";
import { AUTOLOGIN_COOKIE, FILM_PAGE_URL } from "../../constants";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getChatRobotUrl } from "../../util/chatRobotHelpers";
import { toHref } from "../../util/urlHelper";

const StyledLayout = styled(PageLayout, {
  base: {
    display: "flex",
    flexDirection: "row",
    mobileWideDown: {
      flexDirection: "column",
    },
  },
});

const StyledNavList = styled("ul", {
  base: {
    display: "grid",
    listStyle: "none",
    gridTemplateColumns: "repeat(4, minmax(auto, 1fr))",
    gap: "4xsmall",
    justifyContent: "space-between",
    mobileWide: {
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    desktop: {
      alignItems: "flex-start",
    },
  },
});

const StyledLi = styled("li", {
  base: {
    // Menubar on phone should only display first 4 links and the the rest when the modal is open.
    mobileWideDown: {
      "&:not(:nth-of-type(-n + 4))": {
        display: "none",
      },
    },
    desktop: {
      width: "100%",
    },
  },
});

const StyledContent = styled("div", {
  base: {
    width: "100%",
  },
});

const StyledSideBar = styled("div", {
  base: {
    display: "flex",
    flexShrink: "0",
    flexDirection: "row",
    justifyContent: "center",
    background: "background.subtle",
    gap: "4xsmall",
    mobileWideDown: {
      paddingBlock: "4xsmall",
      borderBottom: "1px solid",
      borderColor: "stroke.subtle",
      paddingInline: "4xsmall",
      display: "grid",
      gridTemplateColumns: "4fr 1fr",
    },
    mobileWide: {
      padding: "3xsmall",
      borderRight: "1px solid",
      borderColor: "stroke.subtle",
    },
    desktop: {
      justifyContent: "flex-start",
      gap: "medium",
      flexDirection: "column",
      minWidth: "surface.xsmall",
    },
  },
});

const Separator = styled("hr", {
  base: {
    height: "1px",
    color: "stroke.subtle",
    margin: "small",
  },
});

export const Component = () => {
  return (
    <NoSSR fallback={null}>
      <MyNdlaLayout />
    </NoSSR>
  );
};

export const MyNdlaLayout = () => {
  const { t } = useTranslation();
  const { user, examLock, authenticated, authContextLoaded } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const loginlocation = `/login?state=${routes.myNdla.root}`;

  useEffect(() => {
    const autologin = getCookie(AUTOLOGIN_COOKIE, document.cookie);
    // If in browser, cookie exists due to previous login, and user is not logged in now, redirect user to feide
    if (window.location && autologin && !authenticated && authContextLoaded) {
      window.location.replace(loginlocation);
    }
  }, [loginlocation, authenticated, authContextLoaded]);

  const menuLink = useMemo(
    () =>
      menuLinks(t, location, user).map(
        ({ name, shortName, id, icon, to, iconFilled, shownForUser = true, reloadDocument }) => {
          if (!shownForUser) {
            return null;
          }
          return (
            <StyledLi key={id}>
              {to !== "" ? (
                <NavigationLink
                  name={name}
                  shortName={shortName}
                  icon={icon}
                  to={to}
                  iconFilled={iconFilled}
                  reloadDocument={reloadDocument}
                />
              ) : (
                <Separator key={id} />
              )}
            </StyledLi>
          );
        },
      ),
    [location, t, user],
  );

  return (
    <StyledLayout>
      <DialogRoot key={location.pathname} open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
        <StyledSideBar>
          <nav aria-label={t("myNdla.myNDLAMenu")}>
            <StyledNavList data-testid="my-ndla-menu">{menuLink}</StyledNavList>
          </nav>
          <DialogTrigger asChild>
            <MoreButton variant="tertiary">
              <MoreLine />
              <Text textStyle="label.xsmall">{t("myNdla.iconMenu.more")}</Text>
            </MoreButton>
          </DialogTrigger>
        </StyledSideBar>
        <StyledContent>
          {!!examLock && (
            <MessageBox variant="warning">
              <Text>{t("myNdla.examLockInfo")}</Text>
            </MessageBox>
          )}
          <Outlet />
        </StyledContent>
      </DialogRoot>
    </StyledLayout>
  );
};

export default MyNdlaLayout;

interface MenuLink {
  id: string;
  name: string;
  to: string;
  shortName?: string;
  icon?: ReactElement;
  iconFilled?: ReactElement;
  shownForUser?: boolean;
  reloadDocument?: boolean;
}

export const menuLinks = (
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
    shownForUser: user?.role === "employee",
  },
  {
    id: "separator1",
    name: "",
    to: "",
  },
  {
    id: "arena",
    to: `https://${config.arenaDomain}`,
    name: t("welcomePage.quickLinks.arena.title"),
    shortName: t("welcomePage.quickLinks.arena.title"),
    icon: <ForumOutlined />,
    shownForUser: !!user?.arenaEnabled,
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
    id: "separator2",
    name: "",
    to: "",
  },
  {
    id: "profile",
    to: routes.myNdla.profile,
    name: t("myNdla.myProfile.title"),
    shortName: t("myNdla.iconMenu.profile"),
    icon: <UserLine />,
    iconFilled: <UserFill />,
  },
  {
    id: "logout-path",
    name: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    shortName: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    icon: user ? <LogoutBoxRightLine /> : <LoginBoxLine />,
    to: user ? `/logout?state=${toHref(location)}` : `/login?state=${toHref(location)}`,
    reloadDocument: true,
  },
];
