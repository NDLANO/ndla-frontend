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
import { ChevronDown, Menu } from '@ndla/icons/common';
import { Cross } from '@ndla/icons/action';
import { Drawer } from '@ndla/modal';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLMastheadDrawer_SubjectFragment } from '../../../graphqlTypes';
import { useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { usePrevious } from '../../../util/utilityHooks';
import DefaultMenu from './DefaultMenu';
import DrawerContent from './DrawerContent';
import { MenuType } from './drawerMenuTypes';

const MainMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DrawerContainer = styled.nav`
  display: flex;
  flex: 1;
`;

const HeadWrapper = styled.div`
  padding: ${spacing.small} ${spacing.small};
  display: flex;
  gap: ${spacing.small};
  align-items: center;
  justify-content: space-between;
  ${mq.range({ from: breakpoints.tablet })} {
    max-width: 300px;
    justify-content: center;
  }
`;

interface Props {
  subject?: GQLMastheadDrawer_SubjectFragment;
}

const MastheadDrawer = ({ subject }: Props) => {
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

  const closeSubMenu = useCallback(() => {
    setTopicPath([]);
    setType(undefined);
  }, []);

  const onCloseMenuPortion = useCallback(() => {
    if (type !== 'subject' || !topicPath.length) {
      setType(undefined);
    } else {
      const newPath = topicPath.slice(0, topicPath.length - 1);
      const id = topicPath[topicPath.length - 1];
      if (id) {
        document.getElementById(id)?.focus();
      }
      setTopicPath(newPath);
    }
  }, [topicPath, type]);

  return (
    <Drawer
      expands
      size="xxsmall"
      animationDuration={100}
      animation="fade"
      label={t('masthead.menu.modalLabel')}
      activateButton={
        <ButtonV2
          inverted={ndlaFilm}
          shape="pill"
          variant="outline"
          data-testid="masthead-menu-button"
          aria-label={t('masthead.menu.title')}>
          <Menu />
          Meny
        </ButtonV2>
      }>
      {close => (
        <MainMenu>
          <HeadWrapper>
            <ButtonV2 variant="outline" shape="pill" onClick={close}>
              <Cross />
              Lukk
            </ButtonV2>
            <ButtonV2 variant="outline" shape="pill" onClick={() => {}}>
              Bokmål
              <ChevronDown />
            </ButtonV2>
          </HeadWrapper>
          <DrawerContainer>
            <DefaultMenu
              onClose={close}
              onCloseMenuPortion={onCloseMenuPortion}
              setActiveMenu={setType}
              subject={subject}
              type={type}
              closeSubMenu={closeSubMenu}
            />
            {type && (
              <DrawerContent
                onClose={close}
                type={type}
                topicPath={topicPath}
                subject={subject}
                setTopicPathIds={setTopicPath}
                onCloseMenuPortion={onCloseMenuPortion}
              />
            )}
          </DrawerContainer>
        </MainMenu>
      )}
    </Drawer>
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
