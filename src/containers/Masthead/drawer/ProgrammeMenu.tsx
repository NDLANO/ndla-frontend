/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { colors, spacing } from '@ndla/core';
import SafeLink from '@ndla/safelink';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getProgrammes } from '../../../util/programmesSubjectsHelper';
import DrawerPortion from './DrawerPortion';

interface Props {
  onClose: () => void;
}

interface ProgrammeProps {
  imageUrl: string;
  title: string;
  url: string;
  onClose: () => void;
}

const ProgrammeContainer = styled.li`
  margin: 0;
  border-radius: 2px;
  display: flex;
  align-items: center;
  gap: ${spacing.small};
  background-color: ${colors.brand.greyLighter};
`;

const StyledImage = styled.img`
  width: 48px;
  height: 48px;
  border-bottom-left-radius: 2px;
  border-top-left-radius: 2px;
  object-fit: cover;
`;

const StyledList = styled.ul`
  display: flex;
  margin: 0;
  padding: 0;
  padding-bottom: ${spacing.large};
  flex-direction: column;
  gap: ${spacing.xsmall};
  list-style: none;
`;

const StyledSafeLink = styled(SafeLink)`
  box-shadow: unset;
  text-decoration: none;
  color: ${colors.brand.primary};
  &:hover,
  &:focus {
    text-decoration: underline;
  }
`;

const Programme = ({ imageUrl, title, url, onClose }: ProgrammeProps) => {
  return (
    <ProgrammeContainer>
      <StyledImage src={imageUrl} alt="" />
      <StyledSafeLink to={url} onClick={onClose}>
        {title}
      </StyledSafeLink>
    </ProgrammeContainer>
  );
};

const StyledProgrammeMenu = styled(DrawerPortion)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ProgrammeMenu = ({ onClose }: Props) => {
  const { i18n } = useTranslation();
  const programmes = useMemo(() => getProgrammes(i18n.language), []);

  return (
    <StyledProgrammeMenu>
      <nav>
        <StyledList>
          {programmes.map(programme => (
            <Programme
              key={programme.path}
              title={programme.name}
              url={programme.path}
              imageUrl={programme.imageUrl}
              onClose={onClose}
            />
          ))}
        </StyledList>
      </nav>
    </StyledProgrammeMenu>
  );
};

export default ProgrammeMenu;
