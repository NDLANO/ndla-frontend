/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useMemo, useContext, useState, Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Location, Outlet, useLocation } from "react-router-dom";
import styled from "@emotion/styled";
import { breakpoints, colors, mq, spacing } from "@ndla/core";
import {
  BookReadFill,
  BookReadLine,
  QuestionAnswerFill,
  QuestionAnswerLine,
  HomeFill,
  HomeLine,
  LogoutBoxRightLine,
  AccountCircleFill,
  AccountCircleLine,
  ShieldUserLine,
  ShieldUserFill,
  LoginBoxLine,
} from "@ndla/icons/common";
import { MoreLine } from "@ndla/icons/contentType";
import { FolderFill, FolderLine } from "@ndla/icons/editor";
import { Modal, ModalTrigger } from "@ndla/modal";
import { Button, MessageBox } from "@ndla/primitives";
import { Text } from "@ndla/typography";
import NavigationLink from "./components/NavigationLink";
import { AuthContext, MyNDLAUserType } from "../../components/AuthenticationContext";
import { toHref } from "../../util/urlHelper";

const StyledLayout = styled.div`
  display: flex;
  min-height: 60vh;
  flex-direction: row;
  ${mq.range({ until: breakpoints.mobileWide })} {
    flex-direction: column;
  }
`;

const StyledNavList = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(auto, 1fr));
  grid-gap: ${spacing.xsmall};
  margin: 0px;
  padding: 0 ${spacing.xsmall} 0 0;
  justify-content: space-between;

  ${mq.range({ from: breakpoints.mobileWide })} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    align-items: flex-start;
  }
`;

const StyledLi = styled.li`
  /* Menubar on phone should only display first 4 
  links and the rest when the modal is open */
  &:not(:nth-of-type(-n + 4)) {
    display: none;
  }

  padding: 0;
  margin: 0;
  ${mq.range({ from: breakpoints.mobileWide })} {
    display: unset !important;
  }
  ${mq.range({ from: breakpoints.desktop })} {
    width: 100%;
  }
`;

const StyledContent = styled.div`
  width: 100%;
`;

const StyledSideBar = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid ${colors.brand.lightest};
  background: ${colors.background.lightBlue};
  justify-content: center;

  ${mq.range({ from: breakpoints.mobileWide })} {
    padding: ${spacing.nsmall};
    border-right: 1px solid ${colors.brand.lightest};
    border-bottom: unset;
  }

  ${mq.range({ from: breakpoints.desktop })} {
    justify-content: flex-start;
    gap: ${spacing.normal};
    flex-direction: column;
    min-width: 300px;
    border-right: 1px solid ${colors.brand.lightest};
    border-bottom: unset;
  }
`;

const MoreButton = styled(Button)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  ${mq.range({ from: breakpoints.mobileWide })} {
    display: none;
  }
`;

export interface OutletContext {
  setResetFocus: Dispatch<SetStateAction<boolean>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  resetFocus: boolean;
}

const MyNdlaLayout = () => {
  const { t } = useTranslation();
  const { user, examLock } = useContext(AuthContext);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [resetFocus, setResetFocus] = useState(false);

  const menuLink = useMemo(
    () =>
      menuLinks(t, location, user).map(({ name, shortName, id, icon, to, iconFilled, shownForUser }) => {
        if (shownForUser && !shownForUser(user)) {
          return null;
        }
        return (
          <StyledLi key={id}>
            <NavigationLink id={id} name={name} shortName={shortName} icon={icon} to={to} iconFilled={iconFilled} />
          </StyledLi>
        );
      }),
    [location, t, user],
  );

  return (
    <StyledLayout>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <StyledSideBar>
          <nav aria-label={t("myNdla.myNDLAMenu")}>
            <StyledNavList data-testid="my-ndla-menu">{menuLink}</StyledNavList>
          </nav>
          <ModalTrigger>
            <MoreButton variant="tertiary">
              <MoreLine />
              <Text margin="none" textStyle="meta-text-xxsmall">
                {t("myNdla.iconMenu.more")}
              </Text>
            </MoreButton>
          </ModalTrigger>
        </StyledSideBar>
        <StyledContent>
          {examLock && (
            <MessageBox variant="warning">
              <Text>{t("myNdla.examLockInfo")}</Text>
            </MessageBox>
          )}
          <Outlet context={{ setIsOpen, resetFocus, setResetFocus }} />
        </StyledContent>
      </Modal>
    </StyledLayout>
  );
};

export default MyNdlaLayout;

export const menuLinks = (t: TFunction, location: Location, user: MyNDLAUserType | undefined) => [
  {
    id: "",
    name: t("myNdla.myNDLA"),
    shortName: t("myNdla.myNDLA"),
    icon: <HomeLine />,
    iconFilled: <HomeFill />,
  },
  {
    id: "folders",
    name: t("myNdla.myFolders"),
    shortName: t("myNdla.iconMenu.folders"),
    icon: <FolderLine />,
    iconFilled: <FolderFill />,
  },
  {
    id: "subjects",
    name: t("myNdla.favoriteSubjects.title"),
    shortName: t("myNdla.iconMenu.subjects"),
    icon: <BookReadLine />,
    iconFilled: <BookReadFill />,
  },
  {
    id: "arena",
    name: t("myNdla.arena.title"),
    shortName: t("myNdla.arena.title"),
    icon: <QuestionAnswerLine />,
    iconFilled: <QuestionAnswerFill />,
    shownForUser: (user: MyNDLAUserType | undefined) => user?.arenaEnabled,
  },
  {
    id: "admin",
    name: t("myNdla.arena.admin.title"),
    shortName: t("myNdla.arena.admin.title"),
    icon: <ShieldUserLine />,
    iconFilled: <ShieldUserFill />,
    shownForUser: (user: MyNDLAUserType | undefined) => user?.arenaEnabled && user?.isModerator,
  },
  {
    id: "profile",
    name: t("myNdla.myProfile.title"),
    shortName: t("myNdla.iconMenu.profile"),
    icon: <AccountCircleLine />,
    iconFilled: <AccountCircleFill />,
  },
  {
    id: "logout-path",
    name: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    shortName: user ? t("user.buttonLogOut") : t("user.buttonLogIn"),
    icon: user ? <LogoutBoxRightLine /> : <LoginBoxLine />,
    to: user ? `/logout?state=${toHref(location)}` : `/login?state=${toHref(location)}`,
  },
];
