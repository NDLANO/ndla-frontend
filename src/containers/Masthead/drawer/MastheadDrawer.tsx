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
import { Cross } from '@ndla/icons/lib/action';
import { Drawer } from '@ndla/modal';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLDrawerQuery, GQLDrawerQueryVariables } from '../../../graphqlTypes';
import { useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { useGraphQuery } from '../../../util/runQueries';
import DefaultMenu from './DefaultMenu';
import DrawerContent from './DrawerContent';
import { MenuType } from './drawerMenuTypes';
import { MenuProvider } from './MenuContext';

const MainMenu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const DrawerContainer = styled.div`
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
  const [type, setType] = useState<MenuType | undefined>(undefined);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();
  const { subjectId } = useUrnIds();

  const closeSubMenu = useCallback(() => {
    setType(undefined);
  }, []);

  const { data } = useGraphQuery<GQLDrawerQuery, GQLDrawerQueryVariables>(
    drawerQuery,
    { variables: { subjectId: subjectId! }, skip: !subjectId },
  );

  return (
    <Drawer
      expands
      size="xxsmall"
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
            <MenuProvider>
              <DefaultMenu
                onClose={close}
                setActiveMenu={setType}
                subject={data?.subject}
                type={type}
                closeSubMenu={closeSubMenu}
              />
              {type && (
                <DrawerContent
                  onClose={close}
                  type={type}
                  closeSubMenu={closeSubMenu}
                />
              )}
            </MenuProvider>
          </DrawerContainer>
        </MainMenu>
      )}
    </Drawer>
  );
};

export default MastheadDrawer;
