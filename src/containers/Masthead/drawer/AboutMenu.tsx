/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import { LinkType, ndlaLinks } from '../../../constants';
import BackButton from './BackButton';
import { useDrawerContext } from './DrawerContext';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';
import useArrowNavigation from './useArrowNavigation';
import {
  GQLAboutMenuFragment,
  GQLAboutMenu_FrontpageMenuFragment,
  GQLDrawerContent_FrontpageMenuFragment,
} from '../../../graphqlTypes';
import { toAbout } from '../../../routeHelpers';
import { findBreadcrumb } from '../../AboutPage/AboutPageContent';

interface Props {
  onCloseMenuPortion: () => void;
}

interface NewAboutMenuProps extends Props {
  menuItems: GQLAboutMenu_FrontpageMenuFragment[];
  setMenu: Dispatch<SetStateAction<GQLAboutMenu_FrontpageMenuFragment[]>>;
  onClose: () => void;
}

export const NewAboutMenu = ({
  onCloseMenuPortion,
  onClose,
  setMenu: _setMenu,
  menuItems,
}: NewAboutMenuProps) => {
  const setMenu = useCallback(
    (value: GQLAboutMenu_FrontpageMenuFragment) => {
      const newMenu = findBreadcrumb(menuItems, value.article.slug);
      _setMenu(newMenu as GQLDrawerContent_FrontpageMenuFragment[]);
    },
    [menuItems, _setMenu],
  );

  return menuItems.map((item, index) => (
    <NewAboutMenuPortion
      key={item.article.id}
      setMenu={setMenu}
      item={item}
      onClose={onClose}
      onGoBack={onCloseMenuPortion}
      nextItem={menuItems[index + 1]}
      current={index === menuItems.length - 1}
      homeButton
    />
  ));
};

interface NewAboutMenuPortionProps {
  item: GQLAboutMenu_FrontpageMenuFragment;
  onGoBack: () => void;
  onClose: () => void;
  current?: boolean;
  nextItem?: GQLAboutMenu_FrontpageMenuFragment;
  setMenu: (value: GQLAboutMenu_FrontpageMenuFragment) => void;
  homeButton?: boolean;
}

const NewAboutMenuPortion = ({
  item,
  onGoBack,
  onClose,
  setMenu,
  homeButton,
  current,
  nextItem,
}: NewAboutMenuPortionProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<GQLAboutMenuFragment | undefined>(
    undefined,
  );
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

  useArrowNavigation(!!current, {
    initialFocused: initialKey,
    onRightKeyPressed: onGoRight,
    onLeftKeyPressed: onGoBack,
  });

  if (!item) {
    return;
  }

  return (
    <PortionWrapper>
      <DrawerPortion>
        <BackButton
          title={t('masthead.menu.goToMainMenu')}
          homeButton={homeButton}
          onGoBack={onGoBack}
        />
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
            if (!link.menu?.length) {
              return (
                <DrawerMenuItem
                  key={link.article.slug}
                  id={link.article.slug!}
                  type="link"
                  onClose={onClose}
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
                active={selected?.article.slug === link.article.slug}
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

const AboutMenu = ({ onCloseMenuPortion }: Props) => {
  return (
    <AboutMenuPortion
      type={ndlaLinks}
      onGoBack={onCloseMenuPortion}
      homeButton
    />
  );
};

interface AboutMenuPortionProps {
  type: LinkType;
  homeButton?: boolean;
  onGoBack: () => void;
}

const PortionWrapper = styled.div`
  display: flex;
  flex: 1;
`;

const AboutMenuPortion = ({
  type,
  homeButton,
  onGoBack,
}: AboutMenuPortionProps) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<LinkType | undefined>(undefined);
  const [initialKey, setInitialKey] = useState(`header-${type.key}`);
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();

  useEffect(() => {
    if (!selected && shouldCloseLevel) {
      onGoBack();
      setLevelClosed();
    }
  }, [selected, shouldCloseLevel, onGoBack, setLevelClosed]);

  const onGoRight = useCallback(
    (id?: string) => {
      if (id) {
        setInitialKey(id);
        setSelected(type.subTypes?.find((t) => t.key === id && t.subTypes));
      }
    },
    [type.subTypes],
  );

  const { setFocused } = useArrowNavigation(!selected, {
    initialFocused: initialKey,
    onRightKeyPressed: onGoRight,
    onLeftKeyPressed: onGoBack,
  });

  const onCloseSelected = useCallback(() => {
    setSelected(undefined);
    setFocused(initialKey);
  }, [initialKey, setFocused]);

  return (
    <PortionWrapper>
      <DrawerPortion>
        <BackButton
          title={t('masthead.menu.goToMainMenu')}
          homeButton={homeButton}
          onGoBack={onGoBack}
        />
        <DrawerList id={`list-${type.key}`}>
          <DrawerRowHeader
            id={type.key}
            title={t(`masthead.menuOptions.about.${type.key}`)}
            type="link"
            to={type.link}
            onClose={onGoBack}
            active={!selected}
          />
          {type.subTypes?.map((link) => {
            if (!link.subTypes) {
              return (
                <DrawerMenuItem
                  key={link.key}
                  id={link.key}
                  type="link"
                  to={link.link}
                >
                  {t(`masthead.menuOptions.about.${link.key}`)}
                </DrawerMenuItem>
              );
            }
            return (
              <DrawerMenuItem
                id={link.key}
                key={link.key}
                active={selected?.key === link.key}
                type="button"
                onClick={() => onGoRight(link.key)}
              >
                {t(`masthead.menuOptions.about.${link.key}`)}
              </DrawerMenuItem>
            );
          })}
        </DrawerList>
      </DrawerPortion>
      {selected && (
        <AboutMenuPortion type={selected} onGoBack={onCloseSelected} />
      )}
    </PortionWrapper>
  );
};

const aboutMenuFragment = gql`
  fragment AboutMenu on FrontpageMenu {
    articleId
    article {
      id
      title
      slug
    }
  }
`;

NewAboutMenu.fragments = {
  frontpage: gql`
    fragment AboutMenu_FrontpageMenu on FrontpageMenu {
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
    ${aboutMenuFragment}
  `,
};

export default AboutMenu;
