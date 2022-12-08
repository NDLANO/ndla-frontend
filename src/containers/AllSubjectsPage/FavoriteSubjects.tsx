import { Subject } from './interfaces';
import { Grid } from './SubjectCategory';
import SubjectLink from './SubjectLink';

interface Props {
  subjects: Subject[];
  favorites: string[];
}

const FavoriteSubjects = ({ favorites, subjects }: Props) => {
  const mappedFavorites = subjects.filter(s => favorites.includes(s.id));

  return (
    <div>
      <h2>Mine favoritter</h2>
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
