/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { CarouselAutosize } from '@ndla/carousel';
import { FilmMovieList, MovieGrid } from '@ndla/ui';
import { withTranslation } from 'react-i18next';
import {
  GraphQLArticleMetaShape,
  GraphQLMovieThemeShape,
} from '../../graphqlShapes';
import { breakpoints, findName } from './filmHelper';
import { SUPPORTED_LANGUAGES } from '../../constants';

const MovieCategory = ({
  resourceTypeName,
  themes,
  resourceTypes,
  moviesByType,
  fetchingMoviesByType,
  language,
  resourceTypeSelected,
  loadingPlaceholderHeight,
  t,
}) => (
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
            name={findName(theme.name, language)}
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

MovieCategory.propTypes = {
  resourceTypeName: PropTypes.string,
  themes: PropTypes.arrayOf(GraphQLMovieThemeShape),
  resourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.id,
    }),
  ),
  moviesByType: PropTypes.arrayOf(GraphQLArticleMetaShape),
  fetchingMoviesByType: PropTypes.bool,
  language: PropTypes.oneOf(SUPPORTED_LANGUAGES).isRequired,
  resourceTypeSelected: PropTypes.string,
  loadingPlaceholderHeight: PropTypes.bool,
};

export default withTranslation()(MovieCategory);
