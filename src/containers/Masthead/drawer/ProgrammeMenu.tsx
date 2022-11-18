/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getProgrammes } from '../../../util/programmesSubjectsHelper';
import DrawerMenuItem from './DrawerMenuItem';
import DrawerPortion from './DrawerPortion';
import DrawerRowHeader from './DrawerRowHeader';

interface Props {
  onClose: () => void;
}

const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const ProgrammeMenu = ({ onClose }: Props) => {
  const { i18n } = useTranslation();
  const programmes = useMemo(() => getProgrammes(i18n.language), [
    i18n.language,
  ]);

  return (
    <DrawerPortion>
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
            key={programme.url}>
            {programme.name}
          </DrawerMenuItem>
        ))}
      </StyledNav>
    </DrawerPortion>
  );
};

export default ProgrammeMenu;
