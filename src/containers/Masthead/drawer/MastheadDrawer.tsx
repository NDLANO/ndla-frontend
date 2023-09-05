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
import { breakpoints, mq, spacing } from '@ndla/core';
import { Menu } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { Drawer, Modal, ModalCloseButton, ModalTrigger } from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  GQLDrawerContent_FrontpageMenuFragment,
  GQLMastheadDrawer_SubjectFragment,
  GQLMastheadFrontpageQuery,
  GQLMastheadProgrammeQuery,
} from '../../../graphqlTypes';
import { useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { usePrevious } from '../../../util/utilityHooks';
import DefaultMenu from './DefaultMenu';
import DrawerContent from './DrawerContent';
import { MenuType } from './drawerMenuTypes';
import { DrawerProvider } from './DrawerContext';
import { findBreadcrumb } from '../../AboutPage/AboutPageContent';
import { useGraphQuery } from '../../../util/runQueries';
import { useEnableTaxStructure } from '../../../components/TaxonomyStructureContext';

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
  ${mq.range({ from: breakpoints.tablet })} {
    padding-left: ${spacing.normal};
  }
`;

const DrawerButton = styled(ButtonV2)`
  ${mq.range({ until: breakpoints.tablet })} {
    span {
      display: none;
    }
  }
`;

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
  const [frontpageMenu, _setFrontpageMenu] = useState<
    GQLDrawerContent_FrontpageMenuFragment[]
  >([]);
  const { subjectId, topicList, programme, slug } = useUrnIds();
  const taxEnabled = useEnableTaxStructure();
  const prevProgramme = usePrevious(programme);
  const [type, setType] = useState<MenuType | undefined>(undefined);
  const [topicPath, setTopicPath] = useState<string[]>(topicList);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();

  const frontpageQuery = useGraphQuery<GQLMastheadFrontpageQuery>(
    mastheadFrontpageQuery,
    { skip: !taxEnabled },
  );

  const programmesQuery = useGraphQuery<GQLMastheadProgrammeQuery>(
    mastheadProgrammeQuery,
    { skip: !taxEnabled },
  );

  useEffect(() => {
    if (prevProgramme && !programme && type === 'programme') {
      setType(undefined);
    }
  }, [programme, type]);

  useEffect(() => {
    setTopicPath(topicList);
    if (subjectId) {
      setType('subject');
    } else if (slug) {
      const crumb = findBreadcrumb(
        frontpageQuery.data?.frontpage?.menu ?? [],
        slug,
      );
      const menuItems = !crumb[crumb.length - 1]?.menu?.length
        ? crumb.slice(0, -1)
        : crumb;
      setType('about');
      _setFrontpageMenu(
        (menuItems ?? []) as GQLDrawerContent_FrontpageMenuFragment[],
      );
    } else {
      setType(undefined);
    }
  }, [subjectId, topicList, slug, frontpageQuery.data?.frontpage?.menu]);

  useEffect(() => {
    if (programme && programme !== prevProgramme) {
      setType('programme');
    }
  }, [programme, prevProgramme]);

  const setFrontpageMenu = useCallback(
    (menu: GQLDrawerContent_FrontpageMenuFragment) => {
      _setFrontpageMenu([menu]);
      setType('about');
    },
    [],
  );

  const close = useCallback(() => setOpen(false), []);

  const closeSubMenu = useCallback(() => {
    setTopicPath([]);
    _setFrontpageMenu([]);
    setType(undefined);
  }, []);

  const onCloseMenuPortion = useCallback(() => {
    if (type === 'about') {
      const slicedMenu = frontpageMenu?.slice(0, frontpageMenu?.length - 1);
      _setFrontpageMenu(slicedMenu);
      if (!slicedMenu?.length) {
        setType(undefined);
      }
    } else if (type !== 'subject' || !topicPath.length) {
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

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <DrawerButton
          aria-haspopup="menu"
          inverted={ndlaFilm}
          shape="pill"
          variant="outline"
          data-testid="masthead-menu-button"
          aria-label={t('masthead.menu.title')}
          title={t('masthead.menu.title')}
        >
          <Menu />
          <span>{t('masthead.menu.button')}</span>
        </DrawerButton>
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
                dynamicId={
                  frontpageMenu?.[0]
                    ? `${frontpageMenu[0].article.slug}-dynamic`
                    : undefined
                }
                onClose={close}
                onCloseMenuPortion={onCloseMenuPortion}
                setActiveMenu={setType}
                setFrontpageMenu={setFrontpageMenu}
                dynamicMenus={
                  (frontpageQuery.data?.frontpage?.menu ??
                    []) as GQLDrawerContent_FrontpageMenuFragment[]
                }
                subject={subject}
                type={type}
                closeSubMenu={closeSubMenu}
              />
              {type && (
                <DrawerContent
                  onClose={close}
                  type={type}
                  menuItems={frontpageMenu}
                  topicPath={topicPath}
                  subject={subject}
                  setFrontpageMenu={_setFrontpageMenu}
                  setTopicPathIds={setTopicPath}
                  onCloseMenuPortion={onCloseMenuPortion}
                  programmes={programmesQuery.data?.programmes ?? []}
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
};

export default MastheadDrawer;
