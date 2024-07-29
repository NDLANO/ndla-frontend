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
import BackButton from "./BackButton";
import { useDrawerContext } from "./DrawerContext";
import DrawerMenuItem from "./DrawerMenuItem";
import { DrawerPortion, DrawerHeaderLink, DrawerList, DrawerListItem } from "./DrawerPortion";
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
  parentSlug: String | undefined,
  slug: String | undefined,
  structure?: GQLAboutMenu_FrontpageMenuFragment[],
) => boolean = (parentSlug, slug, structure) => {
  if (parentSlug === slug) return true;
  return (
    structure?.some(
      (item) =>
        (item.article.slug === parentSlug && item?.menu?.some((subItem) => subItem.article.slug === slug)) ||
        checkIfNoCurrent(parentSlug, slug, item.menu),
    ) ?? false
  );
};

const hasHideLevelDeep = (items?: GQLAboutMenu_FrontpageMenuFragment[]): boolean =>
  items?.some((item) => item.hideLevel || hasHideLevelDeep(item.menu)) ?? false;

const filterMenuItems = (items: GQLAboutMenu_FrontpageMenuFragment[]): GQLAboutMenu_FrontpageMenuFragment[] =>
  items
    .filter((item) => !item.hideLevel)
    .map((item) => ({
      ...item,
      menu: item.menu ? filterMenuItems(item.menu) : undefined,
    }));

const filterAndReduceMenuItems = (items: GQLAboutMenu_FrontpageMenuFragment[]) => {
  const hasHideLevel = hasHideLevelDeep(items);
  if (!hasHideLevel) return items;
  return filterMenuItems(items).filter((item) => item.menu?.length);
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
      nextItem={filteredMenuItems[index + 1]}
      lastPortion={index === filteredMenuItems.length - 1}
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
    if (shouldCloseLevel) {
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
    <DrawerPortion>
      <BackButton title={t("masthead.menu.goToMainMenu")} homeButton={homeButton} onGoBack={onGoBack} />
      <DrawerList id={`list-${item.article.slug}`}>
        <DrawerListItem role="none" data-list-item>
          <DrawerHeaderLink
            tabIndex={-1}
            role="menuitem"
            to={toAbout(item.article.slug)}
            onClick={onClose}
            id={`header-${item.article.slug}`}
            data-active={!selected}
            variant="link"
          >
            {item.article.title}
          </DrawerHeaderLink>
        </DrawerListItem>
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
                current={checkIfNoCurrent(link.article.slug, slug, unfilteredMenuItems)}
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
  );
};

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
