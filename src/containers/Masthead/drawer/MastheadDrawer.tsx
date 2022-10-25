/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { Menu } from '@ndla/icons/common';
import { Drawer, ModalCloseButton } from '@ndla/modal';
import { LanguageSelector, Logo } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { useIsNdlaFilm } from '../../../routeHelpers';
import DrawerContent from './DrawerContent';

const DrawerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${spacing.small} ${spacing.small} ${spacing.normal} ${spacing.large};
  gap: ${spacing.normal};
  flex: 1;
`;

const DrawerContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;

const HeadWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

const MastheadDrawer = () => {
  const ndlaFilm = useIsNdlaFilm();
  const { t, i18n } = useTranslation();

  return (
    <Drawer
      expands
      size="small"
      label={t('masthead.menu.modalLabel')}
      activateButton={
        <IconButtonV2
          inverted={ndlaFilm}
          colorTheme="light"
          aria-label={t('masthead.menu.title')}>
          <Menu />
        </IconButtonV2>
      }>
      {close => (
        <DrawerWrapper>
          <HeadWrapper>
            <ModalCloseButton onClick={close} />
            <Logo
              to="/"
              locale={i18n.language}
              label={t('logo.altText')}
              cssModifier={ndlaFilm ? 'white' : ''}
            />
          </HeadWrapper>
          <DrawerContainer>
            <DrawerContent onClose={close} />
            <LanguageSelector
              options={{}}
              center
              outline
              alwaysVisible
              inverted={!!ndlaFilm}
              currentLanguage={i18n.language}
            />
          </DrawerContainer>
        </DrawerWrapper>
      )}
    </Drawer>
  );
};

export default MastheadDrawer;
