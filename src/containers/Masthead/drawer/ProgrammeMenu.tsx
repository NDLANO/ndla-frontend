/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useUrnIds } from '../../../routeHelpers';
import { getProgrammes } from '../../../util/programmesSubjectsHelper';
import BackButton from './BackButton';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';

interface Props {
  onClose: () => void;
  onCloseMenuPortion: () => void;
}

const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const ProgrammeMenu = ({ onClose, onCloseMenuPortion }: Props) => {
  const { i18n } = useTranslation();
  const { programme: activeProgramme } = useUrnIds();
  const programmes = useMemo(() => getProgrammes(i18n.language), [
    i18n.language,
  ]);

  return (
    <DrawerPortion>
      <BackButton title="Go home" homeButton onGoBack={onCloseMenuPortion} />
      <DrawerRowHeader
        title="Utdanningsprogram"
        type="link"
        to=""
        onClose={onClose}
      />
      <StyledNav>
        {programmes.map(programme => (
          <DrawerMenuItem
            type="link"
            to={programme.path}
            onClose={onClose}
            active={
              programme.path.replace('/utdanning/', '') === activeProgramme
            }
            key={programme.url}>
            {programme.name}
          </DrawerMenuItem>
        ))}
      </StyledNav>
    </DrawerPortion>
  );
};

export default memo(ProgrammeMenu);
