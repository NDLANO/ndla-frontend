/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { memo, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUrnIds } from '../../../routeHelpers';
import { getProgrammes } from '../../../util/programmesSubjectsHelper';
import BackButton from './BackButton';
import { useDrawerContext } from './DrawerContext';
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
  const { programme: urlProgramme } = useUrnIds();
  const { shouldCloseLevel, setLevelClosed } = useDrawerContext();
  const programmes = useMemo(
    () => getProgrammes(i18n.language),
    [i18n.language],
  );

  useEffect(() => {
    if (shouldCloseLevel) {
      onCloseMenuPortion();
      setLevelClosed();
    }
  }, [shouldCloseLevel, onCloseMenuPortion, setLevelClosed]);

  const programmePath = `/utdanning/${urlProgramme}`;

  useArrowNavigation(true, {
    initialFocused: programmes[0]?.path,
    onLeftKeyPressed: onCloseMenuPortion,
  });

  return (
    <DrawerPortion>
      <BackButton
        title={t('masthead.menu.goToMainMenu')}
        homeButton
        onGoBack={onCloseMenuPortion}
      />
      <StyledTitle aria-hidden={true}>Utdanningsprogram</StyledTitle>
      <DrawerList id="programme-menu">
        {programmes.map((programme) => (
          <DrawerMenuItem
            id={programme.path}
            type="link"
            to={programme.path}
            current={programme.path === programmePath}
            onClose={onClose}
            active={programme.path === programmePath}
            key={programme.url}
          >
            {programme.name}
          </DrawerMenuItem>
        ))}
      </DrawerList>
    </DrawerPortion>
  );
};

export default memo(ProgrammeMenu);
