import styled from '@emotion/styled';
import { fonts, spacing } from '@ndla/core';
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
  const mappedFavorites = subjects.filter(s => favorites.includes(s.id));

  return (
    <div>
      <StyledHeader>Mine favorittfag</StyledHeader>
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
