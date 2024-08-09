/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { CloseLine, MenuLine } from "@ndla/icons/action";
import { Button, DialogContent, DialogRoot, DialogCloseTrigger, DialogTrigger } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import DefaultMenu from "./DefaultMenu";
import DrawerContent from "./DrawerContent";
import { DrawerProvider } from "./DrawerContext";
import { MenuType } from "./drawerMenuTypes";
import { LanguageSelector } from "../../../components/LanguageSelector";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLDrawerContent_FrontpageMenuFragment,
  GQLMastheadDrawer_SubjectFragment,
  GQLMastheadFrontpageQuery,
  GQLMastheadProgrammeQuery,
} from "../../../graphqlTypes";
import { supportedLanguages } from "../../../i18n";
import { LocaleType } from "../../../interfaces";
import { useUrnIds } from "../../../routeHelpers";
import { useGraphQuery } from "../../../util/runQueries";
import { usePrevious } from "../../../util/utilityHooks";
import { findBreadcrumb } from "../../AboutPage/AboutPageContent";

const MainMenu = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
});

const MenuLanguageContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    "&[data-default-menu='true']": {
      height: "100%",
    },
  },
});

const DrawerContainer = styled("nav", {
  base: {
    display: "flex",
    flex: "1",
  },
});

const HeadWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-start",
    paddingBlock: "medium",
    paddingInlineStart: "small",
    tablet: {
      paddingInlineStart: "medium",
    },
  },
});

const DrawerButton = styled(Button, {
  base: {
    tabletDown: {
      "& span": {
        display: "none",
      },
    },
  },
});

const LanguageSelectWrapper = styled("div", {
  base: {
    paddingBlockEnd: "medium",
    paddingInlineStart: "large",
    width: "max-content",
    mobileWide: {
      paddingBlockStart: "medium",
    },
  },
});

const StyledDrawer = styled(DialogContent, {
  base: {
    display: "flex",
    width: "max-content",
  },
});

interface Props {
  subject?: GQLMastheadDrawer_SubjectFragment;
}

const mastheadFrontpageQuery = gql`
  query mastheadFrontpage {
    frontpage {
      ...DrawerContent_FrontpageMenu
    }
  }
  ${DrawerContent.fragments.frontpage}
`;

const mastheadProgrammeQuery = gql`
  query mastheadProgramme {
    programmes {
      ...DrawerContent_ProgrammePage
    }
  }
  ${DrawerContent.fragments.programmeMenu}
`;

const MastheadDrawer = ({ subject }: Props) => {
  const [open, setOpen] = useState(false);
  const [frontpageMenu, setFrontpageMenu] = useState<GQLDrawerContent_FrontpageMenuFragment[]>([]);
  const { subjectId, topicList, programme, slug } = useUrnIds();
  const prevProgramme = usePrevious(programme);
  const [type, setType] = useState<MenuType | undefined>(undefined);
  const [topicPath, setTopicPath] = useState<string[]>(topicList);
  const { t, i18n } = useTranslation();

  const frontpageQuery = useGraphQuery<GQLMastheadFrontpageQuery>(mastheadFrontpageQuery, {
    skip: typeof window === "undefined",
  });

  const programmesQuery = useGraphQuery<GQLMastheadProgrammeQuery>(mastheadProgrammeQuery, {
    skip: typeof window === "undefined",
  });

  useEffect(() => {
    if (prevProgramme && !programme && type === "programme") {
      setType(undefined);
    }
  }, [programme, type, prevProgramme]);

  useEffect(() => {
    setTopicPath(topicList);
    if (subjectId) {
      setType("subject");
    } else if (slug) {
      const crumb = findBreadcrumb(frontpageQuery.data?.frontpage?.menu ?? [], slug);
      const menuItems = !crumb[crumb.length - 1]?.menu?.length ? crumb.slice(0, -1) : crumb;
      setType("about");
      const firstLevelAboutMenu = frontpageQuery.data?.frontpage?.menu?.[0];
      const defaultMenu = [crumb[0] ?? firstLevelAboutMenu];
      const menuItem = menuItems.length > 0 ? menuItems : defaultMenu;
      setFrontpageMenu(menuItem as GQLDrawerContent_FrontpageMenuFragment[]);
    } else {
      setType(undefined);
    }
  }, [subjectId, topicList, slug, frontpageQuery.data?.frontpage?.menu]);

  useEffect(() => {
    if (programme && programme !== prevProgramme) {
      setType("programme");
    }
  }, [programme, prevProgramme]);

  const handleUpdateFrontpageMenu = useCallback((menu: GQLDrawerContent_FrontpageMenuFragment) => {
    setFrontpageMenu([menu]);
    setType("about");
  }, []);

  const close = useCallback(() => setOpen(false), []);

  const onCloseMenuPortion = useCallback(() => {
    if (type === "about") {
      const slicedMenu = frontpageMenu?.slice(0, frontpageMenu?.length - 1);
      setFrontpageMenu(slicedMenu);
      if (!slicedMenu?.length) {
        setType(undefined);
      }
    } else if (type !== "subject" || !topicPath.length) {
      setType(undefined);
    } else {
      const newPath = topicPath.slice(0, topicPath.length - 1);
      const pathId = topicPath[topicPath.length - 1];
      if (pathId) {
        document.getElementById(pathId)?.focus();
      }
      setTopicPath(newPath);
    }
  }, [frontpageMenu, topicPath, type]);

  const getHeaderElement = () => {
    if (!type) {
      return document.getElementById("header-programme");
    } else if (type === "about") {
      const articleTitle = frontpageMenu[frontpageMenu.length - 1]?.article.slug;
      return document.getElementById(`header-${articleTitle}`);
    } else if (type !== "subject" || !topicPath.length) {
      const links = document.getElementsByTagName("a");
      return links.item(0)?.href.endsWith(SKIP_TO_CONTENT_ID) ? links.item(1) : links.item(0);
    } else {
      return document.getElementById(`header-${topicPath[topicPath.length - 1]}`);
    }
  };

  return (
    <DialogRoot
      variant="drawer"
      position="left"
      size="medium"
      open={open}
      onOpenChange={() => setOpen((prev) => !prev)}
      onEscapeKeyDown={close}
      initialFocusEl={getHeaderElement}
    >
      <DialogTrigger asChild>
        <DrawerButton
          aria-haspopup="menu"
          variant="tertiary"
          data-testid="masthead-menu-button"
          aria-label={t("masthead.menu.title")}
          title={t("masthead.menu.title")}
        >
          <MenuLine />
          <span>{t("masthead.menu.button")}</span>
        </DrawerButton>
      </DialogTrigger>
      <StyledDrawer aria-label={t("masthead.menu.modalLabel")}>
        <MainMenu>
          <HeadWrapper>
            <DialogCloseTrigger asChild>
              <Button variant="tertiary">
                <CloseLine />
                {t("close")}
              </Button>
            </DialogCloseTrigger>
          </HeadWrapper>
          <MenuLanguageContainer data-default-menu={!!type}>
            <DrawerContainer aria-label={t("myNdla.mainMenu")}>
              <DrawerProvider>
                <DefaultMenu
                  dynamicId={frontpageMenu?.[0] ? `${frontpageMenu[0].article?.slug}-dynamic` : undefined}
                  onClose={close}
                  onCloseMenuPortion={onCloseMenuPortion}
                  setActiveMenu={setType}
                  setFrontpageMenu={handleUpdateFrontpageMenu}
                  dynamicMenus={
                    (frontpageQuery.data?.frontpage?.menu ?? []) as GQLDrawerContent_FrontpageMenuFragment[]
                  }
                  subject={subject}
                  type={type}
                />
                {type && (
                  <DrawerContent
                    onClose={close}
                    type={type}
                    menuItems={frontpageMenu}
                    topicPath={topicPath}
                    subject={subject}
                    setFrontpageMenu={setFrontpageMenu}
                    setTopicPathIds={setTopicPath}
                    onCloseMenuPortion={onCloseMenuPortion}
                    programmes={programmesQuery.data?.programmes ?? []}
                  />
                )}
              </DrawerProvider>
            </DrawerContainer>
            {!type && (
              <LanguageSelectWrapper>
                <LanguageSelector
                  items={supportedLanguages}
                  onValueChange={(details) => {
                    setOpen(false);
                    setTimeout(() => i18n.changeLanguage(details.value[0] as LocaleType), 0);
                  }}
                />
              </LanguageSelectWrapper>
            )}
          </MenuLanguageContainer>
        </MainMenu>
      </StyledDrawer>
    </DialogRoot>
  );
};

MastheadDrawer.fragments = {
  subject: gql`
    fragment MastheadDrawer_Subject on Subject {
      ...DefaultMenu_Subject
      ...DrawerContent_Subject
    }
    ${DefaultMenu.fragments.subject}
    ${DrawerContent.fragments.subject}
  `,
};

export default MastheadDrawer;
