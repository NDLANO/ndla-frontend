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
import { GQLDrawerQuery, GQLDrawerQueryVariables } from '../../../graphqlTypes';
import { useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { useGraphQuery } from '../../../util/runQueries';
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

const drawerQuery = gql`
  query drawer($subjectId: String!) {
    subject(id: $subjectId) {
      ...DefaultMenu_Subject
    }
  }
  ${DefaultMenu.fragments.subject}
`;

const MastheadDrawer = () => {
  const { subjectId, topicList, programme } = useUrnIds();
  const prevProgramme = usePrevious(programme);
  const [type, setType] = useState<MenuType | undefined>(undefined);
  const [topicPath, setTopicPath] = useState<string[]>(topicList);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();

  const { data } = useGraphQuery<GQLDrawerQuery, GQLDrawerQueryVariables>(
    drawerQuery,
    { variables: { subjectId: subjectId! }, skip: !subjectId },
  );

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
      setTopicPath(prev => prev.slice(0, prev.length - 1));
    }
  }, [topicPath.length, type]);

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
              subject={data?.subject}
              type={type}
              closeSubMenu={closeSubMenu}
            />
            {type && (
              <DrawerContent
                onClose={close}
                type={type}
                topicPath={topicPath}
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

export default MastheadDrawer;
