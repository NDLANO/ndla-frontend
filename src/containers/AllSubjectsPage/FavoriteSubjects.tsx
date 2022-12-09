import styled from '@emotion/styled';
import { fonts } from '@ndla/core';
import { Subject } from './interfaces';
import { Grid } from './SubjectCategory';
import SubjectLink from './SubjectLink';

const StyledHeader = styled.h2`
  text-transform: uppercase;
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
      <Grid>
        {mappedFavorites.map(subject => (
          <SubjectLink
            favorites={favorites}
            key={subject.id}
            subject={subject}
          />
        ))}
      </Grid>
    </div>
  );
};

export default FavoriteSubjects;
