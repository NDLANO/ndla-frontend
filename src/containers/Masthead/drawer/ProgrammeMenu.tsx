/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getProgrammes } from '../../../util/programmesSubjectsHelper';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion, { DrawerList } from './DrawerPortion';
import useArrowNavigation from './useArrowNavigation';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
}

const StyledTitle = styled.h1`
  margin: 0px;
  ${fonts.sizes('20px', '24px')};
  padding: ${spacing.normal} 0 ${spacing.normal} 40px;
`;

const ProgrammeMenu = ({ onClose, onCloseMenuPortion }: Props) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const programmes = useMemo(() => getProgrammes(i18n.language), [
    i18n.language,
  ]);

  useArrowNavigation(true, programmes[0]?.path, undefined, onCloseMenuPortion);

  return (
    <DrawerPortion>
      <BackButton
        title={t('masthead.menu.goToMainMenu')}
        homeButton
        onGoBack={onCloseMenuPortion}
      />
      <StyledTitle aria-hidden={true}>Utdanningsprogram</StyledTitle>
      <DrawerList id="programme-menu">
        {programmes.map(programme => (
          <DrawerMenuItem
            id={programme.path}
            type="link"
            to={programme.path}
            current={programme.path === location.pathname}
            onClose={onClose}
            active={programme.path === location.pathname}
            key={programme.url}>
            {programme.name}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

export default memo(ProgrammeMenu);
