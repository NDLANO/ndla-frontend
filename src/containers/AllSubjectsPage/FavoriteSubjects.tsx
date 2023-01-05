/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Subject } from './interfaces';
import { GridList } from './SubjectCategory';
import SubjectLink from './SubjectLink';

const StyledHeader = styled.h2`
  text-transform: uppercase;
  margin: ${spacing.normal} ${spacing.nsmall};
  ${fonts.sizes('18px', '24px')}
`;

interface Props {
  subjects: Subject[];
  favorites: string[];
}

const FavoriteSubjects = ({ favorites, subjects }: Props) => {
  const { t } = useTranslation();
  const mappedFavorites = useMemo(
    () => subjects.filter(s => favorites.includes(s.id)),
    [subjects, favorites],
  );

  return (
    <div>
      <StyledHeader>{t('subjectsPage.myFavoriteSubjects')}</StyledHeader>
      <GridList>
        {mappedFavorites.map(subject => (
          <SubjectLink
            favorites={favorites}
            key={subject.id}
            subject={subject}
          />
        ))}
      </GridList>
    </div>
  );
};

export default FavoriteSubjects;
