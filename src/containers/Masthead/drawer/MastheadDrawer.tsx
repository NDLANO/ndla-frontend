/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Menu } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { Drawer, Modal, ModalCloseButton, ModalTrigger } from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GQLMastheadDrawer_FrontpageMenuFragment,
  GQLMastheadDrawer_SubjectFragment,
} from '../../../graphqlTypes';
import { useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { usePrevious } from '../../../util/utilityHooks';
import DefaultMenu from './DefaultMenu';
import DrawerContent from './DrawerContent';
import { MenuType } from './drawerMenuTypes';
import { DrawerProvider } from './DrawerContext';

const MainMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
`;

const DrawerContainer = styled.nav`
  display: flex;
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow-y: hidden;
`;

const HeadWrapper = styled.div`
  padding-top: 22px;
  padding-left: ${spacing.small};
  padding-bottom: 22px;
`;

interface Props {
  subject?: GQLMastheadDrawer_SubjectFragment;
  menu?: GQLMastheadDrawer_FrontpageMenuFragment;
  menuLoading: boolean;
}

const MastheadDrawer = ({ subject, menu }: Props) => {
  const [open, setOpen] = useState(false);
  const [frontpageMenu, _setFrontpageMenu] = useState<
    GQLMastheadDrawer_FrontpageMenuFragment | undefined
  >();
  const { subjectId, topicList, programme } = useUrnIds();
  const prevProgramme = usePrevious(programme);
  const [type, setType] = useState<MenuType | undefined>(undefined);
  const [topicPath, setTopicPath] = useState<string[]>(topicList);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();

  useEffect(() => {
    setTopicPath(topicList);
    if (subjectId) {
      setType('subject');
    } else {
      setType(undefined);
    }
  }, [subjectId, topicList]);

  useEffect(() => {
    if (programme && programme !== prevProgramme) {
      setType('programme');
    }
  }, [programme, prevProgramme]);

  const setFrontpageMenu = useCallback(
    (menu: GQLMastheadDrawer_FrontpageMenuFragment) => {
      _setFrontpageMenu(menu);
      setType('about');
    },
    [],
  );

  const close = useCallback(() => setOpen(false), []);

  const closeSubMenu = useCallback(() => {
    setTopicPath([]);
    setType(undefined);
  }, []);

  const onCloseMenuPortion = useCallback(() => {
    if (type !== 'subject' || !topicPath.length) {
      setType(undefined);
    } else {
      const newPath = topicPath.slice(0, topicPath.length - 1);
      const pathId = topicPath[topicPath.length - 1];
      if (pathId) {
        document.getElementById(pathId)?.focus();
      }
      setTopicPath(newPath);
    }
  }, [topicPath, type]);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2
          aria-haspopup="menu"
          inverted={ndlaFilm}
          shape="pill"
          variant="outline"
          data-testid="masthead-menu-button"
          aria-label={t('masthead.menu.title')}
        >
          <Menu />
          {t('masthead.menu.button')}
        </ButtonV2>
      </ModalTrigger>
      <Drawer
        expands
        position="left"
        size="xsmall"
        animationDuration={100}
        aria-label={t('masthead.menu.modalLabel')}
      >
        <MainMenu>
          <HeadWrapper>
            <ModalCloseButton>
              <ButtonV2 variant="outline" shape="pill">
                <Cross />
                {t('close')}
              </ButtonV2>
            </ModalCloseButton>
          </HeadWrapper>
          <DrawerContainer>
            <DrawerProvider>
              <DefaultMenu
                onClose={close}
                onCloseMenuPortion={onCloseMenuPortion}
                setActiveMenu={setType}
                setFrontpageMenu={setFrontpageMenu}
                dynamicMenus={
                  (menu?.menu ??
                    []) as GQLMastheadDrawer_FrontpageMenuFragment[]
                }
                subject={subject}
                type={type}
                closeSubMenu={closeSubMenu}
              />
              {type && (
                <DrawerContent
                  onClose={close}
                  type={type}
                  menu={frontpageMenu}
                  topicPath={topicPath}
                  subject={subject}
                  setTopicPathIds={setTopicPath}
                  onCloseMenuPortion={onCloseMenuPortion}
                />
              )}
            </DrawerProvider>
          </DrawerContainer>
        </MainMenu>
      </Drawer>
    </Modal>
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
  frontpage: gql`
    fragment MastheadDrawer_FrontpageMenu on FrontpageMenu {
      ...DrawerContent_FrontpageMenu
    }
    ${DrawerContent.fragments.frontpage}
  `,
};

export default MastheadDrawer;
