/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useCallback, useEffect, useState } from 'react';
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
} from '../../../graphqlTypes';

interface Props {
  onCloseMenuPortion: () => void;
}

interface NewAboutMenuProps extends Props {
  menu: GQLAboutMenu_FrontpageMenuFragment;
  onClose: () => void;
}

export const NewAboutMenu = ({
  onCloseMenuPortion,
  onClose,
  menu,
}: NewAboutMenuProps) => {
  return (
    <NewAboutMenuPortion
      item={menu}
      onClose={onClose}
      onGoBack={onCloseMenuPortion}
      homeButton
    />
  );
};

interface NewAboutMenuPortionProps {
  item: GQLAboutMenu_FrontpageMenuFragment;
  onGoBack: () => void;
  onClose: () => void;
  homeButton?: boolean;
}

const NewAboutMenuPortion = ({
  item,
  onGoBack,
  onClose,
  homeButton,
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
    if (!initialKey && item) {
      setInitialKey(`header-${item.article.slug}`);
    }
  }, [initialKey, item]);

  const onGoRight = useCallback(
    (slug?: string) => {
      if (slug && item) {
        setInitialKey(slug);
        setSelected(item.menu?.find((t) => t.article.slug === slug && t.menu));
      }
    },
    [item],
  );

  const { setFocused } = useArrowNavigation(!selected, {
    initialFocused: initialKey,
    onRightKeyPressed: onGoRight,
    onLeftKeyPressed: onGoBack,
  });

  const onCloseSelected = useCallback(() => {
    setSelected(undefined);
    setFocused(initialKey!);
  }, [initialKey, setFocused]);

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
            to={`/about/${item.article.slug}`}
            onClose={onClose}
            active={!selected}
          />
          {item.menu.map((link) => {
            if (!link.menu?.length) {
              return (
                <DrawerMenuItem
                  key={link.article.slug}
                  id={link.article.slug!}
                  type="link"
                  onClose={onClose}
                  to={`/about/${link.article.slug}`}
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
      {selected && (
        <NewAboutMenuPortion
          onClose={onClose}
          item={selected as GQLAboutMenu_FrontpageMenuFragment}
          onGoBack={onCloseSelected}
        />
      )}
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
