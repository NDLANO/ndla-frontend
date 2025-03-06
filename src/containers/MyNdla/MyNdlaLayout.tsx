/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useMemo, useContext, useState, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { Location, Outlet, useLocation } from "react-router-dom";
import {
  BookReadFill,
  BookReadLine,
  Forum,
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
import {
  Button,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import NavigationLink, { MoreButton } from "./components/NavigationLink";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageLayout } from "../../components/Layout/PageContainer";
import { useToast } from "../../components/ToastContext";
import config from "../../config";
import { GQLMyNdlaPersonalDataFragmentFragment } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { AcceptArenaDialog } from "./components/AcceptArenaDialog";
import { MyNdlaButton } from "./components/MyNdlaButton";
import { useUpdatePersonalData } from "./userMutations";
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

const StyledMyNdlaButton = styled(MyNdlaButton, {
  base: {
    width: "100%",
  },
});

const StyledDialogBody = styled(DialogBody, {
  base: {
    display: "flex",
    flexDirection: "column",
    height: "unset",
    gap: "large",
  },
});

const MyNdlaLayout = () => {
  const { t } = useTranslation();
  const { user, examLock, authenticated } = useContext(AuthContext);
  const { updatePersonalData, loading: updateLoading } = useUpdatePersonalData();
  const toast = useToast();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const menuLink = useMemo(
    () =>
      menuLinks(t, location, user).map(
        ({ name, shortName, id, icon, to, iconFilled, shownForUser, reloadDocument }) => {
          if (shownForUser && !shownForUser(user)) {
            return null;
          }
          return (
            <StyledLi key={id}>
              <NavigationLink
                name={name}
                shortName={shortName}
                icon={icon}
                to={to}
                iconFilled={iconFilled}
                reloadDocument={reloadDocument}
              />
            </StyledLi>
          );
        },
      ),
    [location, t, user],
  );

  const onAcceptShareName = async () => {
    const res = await updatePersonalData({ variables: { shareNameAccepted: true } });
    if (!res.errors?.length) {
      // do nothing, everything is fine
    } else {
      toast.create({ title: t("myNdla.shareName.accept.error") });
    }
  };

  return (
    <StyledLayout>
      <DialogRoot key={location.pathname} open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
        <StyledSideBar>
          <nav aria-label={t("myNdla.myNDLAMenu")}>
            <StyledNavList data-testid="my-ndla-menu">
              {menuLink}
              {!!user?.arenaEnabled && !user?.arenaAccepted && (
                <AcceptArenaDialog>
                  <StyledLi>
                    <DialogTrigger asChild>
                      <StyledMyNdlaButton>
                        <ForumOutlined />
                        {t("myNdla.arena.title")}
                      </StyledMyNdlaButton>
                    </DialogTrigger>
                  </StyledLi>
                </AcceptArenaDialog>
              )}
            </StyledNavList>
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
          {authenticated && !user?.shareNameAccepted && user?.role === "employee" ? (
            <DialogRoot modal open={!user?.shareNameAccepted}>
              <DialogContent>
                <StyledDialogBody>
                  <DialogTitle textStyle="heading.small">{t("myNdla.acceptedShareName.title")}</DialogTitle>
                  <Text textStyle="body.xlarge">{t("myNdla.acceptedShareName.subtitle")}</Text>
                  <Text textStyle="body.large">{t("myNdla.acceptedShareName.description")}</Text>
                </StyledDialogBody>
                <DialogFooter>
                  <Button
                    variant="primary"
                    type="button"
                    loading={updateLoading}
                    onClick={() => {
                      onAcceptShareName();
                    }}
                  >
                    {t("myNdla.acceptedShareName.button")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          ) : null}
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
  shownForUser?: (user: GQLMyNdlaPersonalDataFragmentFragment | undefined) => boolean;
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
    id: "subjects",
    to: routes.myNdla.subjects,
    name: t("myNdla.favoriteSubjects.title"),
    shortName: t("myNdla.iconMenu.subjects"),
    icon: <BookReadLine />,
    iconFilled: <BookReadFill />,
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
    id: "learningpaths",
    to: routes.myNdla.learningpath,
    name: t("myNdla.learningpath.title"),
    shortName: t("myNdla.iconMenu.learningpath"),
    icon: <RouteLine />,
    iconFilled: <RouteFill />,
    shownForUser: (user) => user?.role === "employee",
  },
  {
    id: "arena",
    to: `https://${config.arenaDomain}`,
    name: t("myNdla.arena.title"),
    shortName: t("myNdla.arena.title"),
    icon: <ForumOutlined />,
    iconFilled: <Forum />,
    shownForUser: (user) => !!user?.arenaEnabled && !!user?.arenaAccepted,
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
