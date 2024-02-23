/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import BackButton from "./BackButton";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import DrawerPortion, { DrawerList } from "./DrawerPortion";
import DrawerRowHeader from "./DrawerRowHeader";
import useArrowNavigation from "./useArrowNavigation";
import {
  GQLAboutMenuFragment,
  GQLAboutMenu_FrontpageMenuFragment,
  GQLDrawerContent_FrontpageMenuFragment,
} from "../../../graphqlTypes";
import { toAbout, useTypedParams } from "../../../routeHelpers";
import { findBreadcrumb } from "../../AboutPage/AboutPageContent";

interface Props {
  onCloseMenuPortion: () => void;
}

interface NewAboutMenuProps extends Props {
  menuItems: GQLAboutMenu_FrontpageMenuFragment[];
  setMenu: Dispatch<SetStateAction<GQLAboutMenu_FrontpageMenuFragment[]>>;
  onClose: () => void;
}
const checkIfNoCurrent: (
  structure: GQLAboutMenu_FrontpageMenuFragment[],
  parentSlug: String | undefined,
  slug: String | undefined,
) => any = (structure, parentSlug, slug) => {
  if (parentSlug === slug) return true;
  for (const item of structure) {
    if (item.article.slug === parentSlug) {
      if (item.menu && item.menu.some((subItem) => subItem.article.slug === slug)) {
        return true;
      }
    }
    if (item.menu && checkIfNoCurrent(item.menu, parentSlug, slug)) {
      return true;
    }
  }
  return false;
};

const filterAndReduceMenuItems = (items: GQLAboutMenu_FrontpageMenuFragment[]) => {
  const filterMenuItems = (items: GQLAboutMenu_FrontpageMenuFragment[]): GQLAboutMenu_FrontpageMenuFragment[] => {
    const filteredItems = items
      .filter((item) => {
        const shouldInclude = !item.hideLevel;
        return shouldInclude;
      })
      .map((item) => {
        const newItem = {
          ...item,
          menu: item.menu ? filterMenuItems(item.menu) : [],
        };
        if (newItem.menu && newItem.menu.length === 0) {
          const { menu, ...emptyItem } = newItem;
          return emptyItem;
        }
        return newItem;
      });
    return filteredItems;
  };
  const filteredMenuItems = filterMenuItems(items);
  return filteredMenuItems.filter((item) => item.menu && item.menu.length > 0);
};

export const AboutMenu = ({ onCloseMenuPortion, onClose, setMenu: _setMenu, menuItems }: NewAboutMenuProps) => {
  const filteredMenuItems = filterAndReduceMenuItems(menuItems);
  const setMenu = useCallback(
    (value: GQLAboutMenu_FrontpageMenuFragment) => {
      const newMenu = findBreadcrumb(filteredMenuItems, value.article.slug);
      _setMenu(newMenu as GQLDrawerContent_FrontpageMenuFragment[]);
    },
    [filteredMenuItems, _setMenu],
  );
  return filteredMenuItems.map((item, index) => (
    <NewAboutMenuPortion
      unfilteredMenuItems={menuItems}
      key={item.article.id}
      setMenu={setMenu}
      item={item}
      onClose={onClose}
      onGoBack={onCloseMenuPortion}
      nextItem={menuItems[index + 1]}
      lastPortion={index === menuItems.length - 1}
      homeButton
    />
  ));
};

interface NewAboutMenuPortionProps {
  unfilteredMenuItems: GQLAboutMenu_FrontpageMenuFragment[];
  item: GQLAboutMenu_FrontpageMenuFragment;
  onGoBack: () => void;
  onClose: () => void;
  lastPortion?: boolean;
  nextItem?: GQLAboutMenu_FrontpageMenuFragment;
  setMenu: (value: GQLAboutMenu_FrontpageMenuFragment) => void;
  homeButton?: boolean;
}

const NewAboutMenuPortion = ({
  unfilteredMenuItems,
  item,
  onGoBack,
  onClose,
  setMenu,
  homeButton,
  lastPortion,
  nextItem,
}: NewAboutMenuPortionProps) => {
  const { t } = useTranslation();
  const { slug } = useTypedParams();
  const [selected, setSelected] = useState<GQLAboutMenuFragment | undefined>(undefined);
  const [initialKey, setInitialKey] = useState<string | undefined>(undefined);

  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();

  useEffect(() => {
    if (!selected && shouldCloseLevel) {
      onGoBack();
      setLevelClosed();
    }
  }, [selected, shouldCloseLevel, onGoBack, setLevelClosed]);

  useEffect(() => {
    if (!initialKey && nextItem) {
      setInitialKey(nextItem.article.slug);
      setSelected(nextItem);
    } else if (!initialKey && item) {
      setInitialKey(`header-${item.article.slug}`);
    }
  }, [initialKey, item, nextItem]);

  const onLeft = useCallback(() => {
    setSelected(undefined);
    onGoBack();
  }, [onGoBack]);

  const onGoRight = useCallback(
    (slug?: string) => {
      const newItem = item.menu?.find((t) => t.article.slug === slug && t.menu);
      if (newItem) {
        setMenu(newItem);
        setInitialKey(slug);
        setSelected(newItem);
      }
    },
    [item, setMenu],
  );

  useArrowNavigation(!!lastPortion, {
    initialFocused: initialKey,
    onRightKeyPressed: onGoRight,
    onLeftKeyPressed: onLeft,
  });

  if (!item) {
    return;
  }

  return (
    <PortionWrapper>
      <DrawerPortion>
        <BackButton title={t("masthead.menu.goToMainMenu")} homeButton={homeButton} onGoBack={onGoBack} />
        <DrawerList id={`list-${item.article.slug}`}>
          <DrawerRowHeader
            id={item.article.slug}
            title={item.article.title}
            type="link"
            to={toAbout(item.article.slug)}
            onClose={onClose}
            active={!selected}
          />
          {item.menu?.map((link) => {
            const allSublevelsHidden = link.menu?.every((subItem) => subItem.hideLevel) ?? false;
            if (link.hideLevel) {
              return null;
            }
            if (!link.menu?.length || allSublevelsHidden) {
              return (
                <DrawerMenuItem
                  key={link.article.slug}
                  id={link.article.slug!}
                  type="link"
                  onClose={onClose}
                  current={checkIfNoCurrent(unfilteredMenuItems, link.article.slug, slug)} //{link.article.slug === slug}
                  to={toAbout(link.article.slug)}
                >
                  {link.article.title}
                </DrawerMenuItem>
              );
            }
            return (
              <DrawerMenuItem
                id={link.article.slug!}
                key={link.article.slug}
                active={nextItem?.article.slug === link.article.slug}
                type="button"
                onClick={() => onGoRight(link.article.slug)}
              >
                {link.article.title}
              </DrawerMenuItem>
            );
          })}
        </DrawerList>
      </DrawerPortion>
    </PortionWrapper>
  );
};

const PortionWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const aboutMenuFragment = gql`
  fragment AboutMenu on FrontpageMenu {
    articleId
    hideLevel
    article {
      id
      title
      slug
    }
  }
`;

AboutMenu.fragments = {
  frontpage: gql`
    fragment AboutMenu_FrontpageMenu on FrontpageMenu {
      ...AboutMenu
      menu {
        ...AboutMenu
        menu {
          ...AboutMenu
          menu {
            ...AboutMenu
            menu {
              ...AboutMenu
            }
          }
        }
      }
    }
    ${aboutMenuFragment}
  `,
};

export default AboutMenu;
