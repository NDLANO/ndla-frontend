/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ArrowLeftLine } from "@ndla/icons/common";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { MenuType } from "./drawerMenuTypes";
import { DrawerPortion, DrawerHeader, DrawerList, DrawerListItem } from "./DrawerPortion";
import DrawerRowHeader from "./DrawerRowHeader";
import useArrowNavigation from "./useArrowNavigation";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import {
  FILM_PAGE_PATH,
  FILM_PAGE_URL,
  MULTIDISCIPLINARY_SUBJECT_ID,
  MULTIDISCIPLINARY_URL,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_STUDENT_URL,
  TOOLBOX_TEACHER_SUBJECT_ID,
  TOOLBOX_TEACHER_URL,
} from "../../../constants";
import { GQLDefaultMenu_RootFragment, GQLDrawerContent_FrontpageMenuFragment } from "../../../graphqlTypes";
import { removeUrn } from "../../../routeHelpers";
import { usePrevious } from "../../../util/utilityHooks";

const StyledCollapsedMenu = styled("div", {
  base: {
    paddingInline: "medium",
    paddingBlockStart: "xxlarge",
    borderTop: "1px solid",
    borderColor: "stroke.subtle",
    tabletDown: {
      display: "none",
    },
  },
});

const StyledDrawerPortion = styled(DrawerPortion, {
  base: {
    tablet: {
      minWidth: "surface.xsmall",
      maxWidth: "surface.small",
    },
  },
});

const filmUrl = (enablePrettyUrl: boolean) => (enablePrettyUrl ? FILM_PAGE_URL : FILM_PAGE_PATH);
const multiDiscUrl = (enablePrettyUrl: boolean) =>
  enablePrettyUrl ? MULTIDISCIPLINARY_URL : `/${removeUrn(MULTIDISCIPLINARY_SUBJECT_ID)}`;
const studentToolboxUrl = (enablePrettyUrl: boolean) =>
  enablePrettyUrl ? TOOLBOX_STUDENT_URL : `/${removeUrn(TOOLBOX_STUDENT_SUBJECT_ID)}`;
const teacherToolboxUrl = (enablePrettyUrl: boolean) =>
  enablePrettyUrl ? TOOLBOX_TEACHER_URL : `/${removeUrn(TOOLBOX_TEACHER_SUBJECT_ID)}`;

interface Props {
  onClose: () => void;
  setActiveMenu: (type: MenuType | undefined) => void;
  setFrontpageMenu: (menu: GQLDrawerContent_FrontpageMenuFragment) => void;
  dynamicMenus: GQLDrawerContent_FrontpageMenuFragment[];
  dynamicId?: string;
  root?: GQLDefaultMenu_RootFragment;
  type?: MenuType;
  onCloseMenuPortion: () => void;
}

const validMenus: MenuType[] = ["subject", "programme", "om"];

const DefaultMenu = ({ onClose, setActiveMenu, root, type, setFrontpageMenu, dynamicMenus, dynamicId }: Props) => {
  const previousType = usePrevious(type);
  const { t } = useTranslation();
  const enablePrettyUrl = useEnablePrettyUrls();
  const { setShouldCloseLevel } = useDrawerContext();

  const onRightClick = useCallback(
    (id: string | undefined) => {
      const strippedId = id?.replace("header-", "");
      if (validMenus.includes(strippedId as MenuType)) {
        setActiveMenu(strippedId as MenuType);
      } else if (id?.endsWith("-dynamic")) {
        setFrontpageMenu(dynamicMenus.find((menu) => menu.article.slug === strippedId?.replace("-dynamic", ""))!);
      }
    },
    [dynamicMenus, setActiveMenu, setFrontpageMenu],
  );

  useArrowNavigation(!type, {
    initialFocused: `header-${dynamicId ?? type ?? previousType ?? "programme"}`,
    onRightKeyPressed: onRightClick,
    multilevel: true,
  });

  if (type) {
    return (
      <StyledCollapsedMenu>
        <IconButton onClick={setShouldCloseLevel} aria-label={t("menu.goBack")} variant="secondary">
          <ArrowLeftLine />
        </IconButton>
      </StyledCollapsedMenu>
    );
  }
  return (
    <StyledDrawerPortion>
      <DrawerList>
        <DrawerListItem>
          <DrawerHeader textStyle="label.large" fontWeight="bold" tabIndex={-1} asChild consumeCss>
            <span>{t("menu.subjectAndProgramme")}</span>
          </DrawerHeader>
        </DrawerListItem>
        <DrawerRowHeader
          ownsId="programme-menu"
          id="programme"
          type="button"
          title={t("masthead.menuOptions.programme")}
          onClick={() => setActiveMenu("programme")}
        />
        {root && root.nodeType === "SUBJECT" && (
          <DrawerRowHeader
            ownsId="subject-menu"
            id="subject"
            type="button"
            title={root.name}
            onClick={() => setActiveMenu("subject")}
          />
        )}
        <DrawerRowHeader
          type="link"
          id="subjects"
          to="/subjects"
          title={t("masthead.menuOptions.subjects")}
          onClose={onClose}
        />
        <DrawerMenuItem id="film" type="link" to={filmUrl(enablePrettyUrl)} onClose={onClose}>
          {t("masthead.menuOptions.film")}
        </DrawerMenuItem>
        <DrawerMenuItem id="multidisciplinary" type="link" to={multiDiscUrl(enablePrettyUrl)} onClose={onClose}>
          {t("masthead.menuOptions.multidisciplinarySubjects")}
        </DrawerMenuItem>
        <DrawerListItem>
          <DrawerHeader textStyle="label.large" tabIndex={-1} fontWeight="bold" asChild consumeCss>
            <span>{t("menu.tipsAndAdvice")}</span>
          </DrawerHeader>
        </DrawerListItem>
        <DrawerMenuItem id="toolboxStudents" type="link" to={studentToolboxUrl(enablePrettyUrl)} onClose={onClose}>
          {t("masthead.menuOptions.toolboxStudents")}
        </DrawerMenuItem>
        <DrawerMenuItem id="toolboxTeachers" type="link" to={teacherToolboxUrl(enablePrettyUrl)} onClose={onClose}>
          {t("masthead.menuOptions.toolboxTeachers")}
        </DrawerMenuItem>
        <DrawerListItem>
          <DrawerHeader textStyle="label.large" tabIndex={-1} fontWeight="bold" asChild consumeCss>
            <span>{t("menu.about")}</span>
          </DrawerHeader>
        </DrawerListItem>
        {dynamicMenus.map((menu) => (
          <DrawerRowHeader
            key={menu.article.slug}
            ownsId={`${menu.article.slug}-menu`}
            id={`${menu.article.slug}-dynamic`}
            type="button"
            title={menu.article.title}
            onClick={() => setFrontpageMenu(menu)}
          />
        ))}
      </DrawerList>
    </StyledDrawerPortion>
  );
};

DefaultMenu.fragments = {
  root: gql`
    fragment DefaultMenu_Root on Node {
      id
      name
      url
      path
      nodeType
    }
  `,
};

export default DefaultMenu;
