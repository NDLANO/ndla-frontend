/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CarouselAutosize } from '@ndla/carousel';
import { FilmMovieList, MovieGrid } from '@ndla/ui';
import { gql } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { breakpoints, findName } from './filmHelper';
import { GQLMovieCategory_MovieThemeFragment } from '../../graphqlTypes';
import { MoviesByType } from './NdlaFilmFrontpage';
import { movieFragment } from '../../queries';

interface Props {
  fetchingMoviesByType?: boolean;
  resourceTypeName?: { name: string; id: string };
  themes: GQLMovieCategory_MovieThemeFragment[];
  resourceTypes: { name: string; id: string }[];
  moviesByType?: MoviesByType[];
  resourceTypeSelected?: string;
  loadingPlaceholderHeight?: string;
}

const MovieCategory = ({
  resourceTypeName,
  themes,
  resourceTypes,
  moviesByType,
  fetchingMoviesByType,
  resourceTypeSelected,
  loadingPlaceholderHeight,
}: Props) => {
  const { t, i18n } = useTranslation();
  return (
    <CarouselAutosize breakpoints={breakpoints} itemsLength={themes.length}>
      {(autoSizedProps) =>
        resourceTypeSelected ? (
          <MovieGrid
            autoSizedProps={autoSizedProps}
            resourceTypeName={resourceTypeName}
            fetchingMoviesByType={!!fetchingMoviesByType}
            moviesByType={moviesByType ?? []}
            resourceTypes={resourceTypes}
            loadingPlaceholderHeight={loadingPlaceholderHeight}
          />
        ) : (
          themes.map((theme) => (
            <FilmMovieList
              key={theme.name[0]?.name}
              name={findName(theme.name ?? [], i18n.language)}
              movies={theme.movies}
              autoSizedProps={autoSizedProps}
              slideForwardsLabel={t('ndlaFilm.slideForwardsLabel')}
              slideBackwardsLabel={t('ndlaFilm.slideBackwardsLabel')}
              resourceTypes={resourceTypes}
            />
          ))
        )
      }
    </CarouselAutosize>
  );
};

MovieCategory.fragments = {
  movieTheme: gql`
    fragment MovieCategory_MovieTheme on MovieTheme {
      name {
        name
        language
      }
      movies {
        ...MovieInfo
      }
    }
    ${movieFragment}
  `,
};

export default MovieCategory;
