/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { CarouselAutosize } from '@ndla/carousel';
//@ts-ignore
import { FilmMovieList, MovieGrid } from '@ndla/ui';
import { WithTranslation, withTranslation } from 'react-i18next';
import { breakpoints, findName } from './filmHelper';
import { GQLMovieTheme } from '../../graphqlTypes';
import { MoviesByType } from './NdlaFilmFrontpage';

interface Props {
  fetchingMoviesByType?: boolean;
  resourceTypeName?: { name?: string; id?: string };
  themes: GQLMovieTheme[];
  resourceTypes?: { name?: string; id?: string }[];
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
  t,
  i18n,
}: Props & WithTranslation) => (
  <CarouselAutosize breakpoints={breakpoints}>
    {autoSizedProps =>
      resourceTypeSelected ? (
        <MovieGrid
          autoSizedProps={autoSizedProps}
          resourceTypeName={resourceTypeName}
          fetchingMoviesByType={fetchingMoviesByType}
          moviesByType={moviesByType}
          resourceTypes={resourceTypes}
          loadingPlaceholderHeight={loadingPlaceholderHeight}
        />
      ) : (
        themes.map(theme => (
          <FilmMovieList
            key={theme.name}
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

export default withTranslation()(MovieCategory);
