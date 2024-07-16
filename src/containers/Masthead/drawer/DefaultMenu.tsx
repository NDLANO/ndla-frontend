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
import { Back } from "@ndla/icons/common";
import { IconButton } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { MenuType } from "./drawerMenuTypes";
import { DrawerPortion, DrawerHeader, DrawerList, DrawerListItem } from "./DrawerPortion";
import DrawerRowHeader from "./DrawerRowHeader";
import useArrowNavigation from "./useArrowNavigation";
import {
  FILM_PAGE_PATH,
  MULTIDISCIPLINARY_SUBJECT_ID,
  TOOLBOX_STUDENT_SUBJECT_ID,
  TOOLBOX_TEACHER_SUBJECT_ID,
} from "../../../constants";
import { GQLDefaultMenu_SubjectFragment, GQLDrawerContent_FrontpageMenuFragment } from "../../../graphqlTypes";
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

const multiDiscUrl = `/${removeUrn(MULTIDISCIPLINARY_SUBJECT_ID)}`;
const studentToolboxUrl = `/${removeUrn(TOOLBOX_STUDENT_SUBJECT_ID)}`;
const teacherToolboxUrl = `/${removeUrn(TOOLBOX_TEACHER_SUBJECT_ID)}`;

interface Props {
  onClose: () => void;
  setActiveMenu: (type: MenuType | undefined) => void;
  setFrontpageMenu: (menu: GQLDrawerContent_FrontpageMenuFragment) => void;
  dynamicMenus: GQLDrawerContent_FrontpageMenuFragment[];
  dynamicId?: string;
  subject?: GQLDefaultMenu_SubjectFragment;
  type?: MenuType;
  onCloseMenuPortion: () => void;
}

const validMenus: MenuType[] = ["subject", "programme", "about"];

const DefaultMenu = ({ onClose, setActiveMenu, subject, type, setFrontpageMenu, dynamicMenus, dynamicId }: Props) => {
  const previousType = usePrevious(type);
  const { t } = useTranslation();
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
          <Back />
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
        {subject && (
          <DrawerRowHeader
            ownsId="subject-menu"
            id="subject"
            type="button"
            title={subject.name}
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
        <DrawerMenuItem id="film" type="link" to={FILM_PAGE_PATH} onClose={onClose}>
          {t("masthead.menuOptions.film")}
        </DrawerMenuItem>
        <DrawerMenuItem id="multidisciplinary" type="link" to={multiDiscUrl} onClose={onClose}>
          {t("masthead.menuOptions.multidisciplinarySubjects")}
        </DrawerMenuItem>
        <DrawerListItem>
          <DrawerHeader textStyle="label.large" tabIndex={-1} fontWeight="bold" asChild consumeCss>
            <span>{t("menu.tipsAndAdvice")}</span>
          </DrawerHeader>
        </DrawerListItem>
        <DrawerMenuItem id="toolboxStudents" type="link" to={studentToolboxUrl} onClose={onClose}>
          {t("masthead.menuOptions.toolboxStudents")}
        </DrawerMenuItem>
        <DrawerMenuItem id="toolboxTeachers" type="link" to={teacherToolboxUrl} onClose={onClose}>
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
  subject: gql`
    fragment DefaultMenu_Subject on Subject {
      id
      name
    }
  `,
};

export default DefaultMenu;
