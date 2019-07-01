/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { CarouselAutosize } from '@ndla/carousel';
import { FilmMovieList, MovieGrid } from '@ndla/ui';
import { spacing } from '@ndla/core';
import {
  GraphQLArticleMetaShape,
  GraphQLMovieThemeShape,
} from '../../graphqlShapes';

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

const findName = (themeNames, language) => {
  const name = themeNames.filter(name => name.language === language);
  const fallback = themeNames.filter(name => name.language === 'nb');
  if (name.length > 0) {
    return name.map(n => n.name);
  } else if (fallback.length > 0) {
    return fallback.map(n => n.name);
  } else {
    return '';
  }
};

const breakpoints = [
  {
    until: 'mobile',
    columnsPrSlide: 1,
    distanceBetweenItems: spacing.spacingUnit / 2,
    margin: spacing.spacingUnit,
    arrowOffset: 13,
  },
  {
    until: 'mobileWide',
    columnsPrSlide: 2,
    distanceBetweenItems: spacing.spacingUnit / 2,
    margin: spacing.spacingUnit,
    arrowOffset: 13,
  },
  {
    until: 'tabletWide',
    columnsPrSlide: 3,
    distanceBetweenItems: spacing.spacingUnit / 2,
    margin: spacing.spacingUnit,
    arrowOffset: 13,
  },
  {
    until: 'desktop',
    columnsPrSlide: 4,
    distanceBetweenItems: spacing.spacingUnit,
    margin: spacing.spacingUnit * 2,
    arrowOffset: 0,
  },
  {
    until: 'wide',
    columnsPrSlide: 4,
    distanceBetweenItems: spacing.spacingUnit,
    margin: spacing.spacingUnit * 2,
    arrowOffset: 0,
  },
  {
    until: 'ultraWide',
    columnsPrSlide: 4,
    distanceBetweenItems: spacing.spacingUnit,
    margin: spacing.spacingUnit * 3.5,
    arrowOffset: 0,
  },
  {
    columnsPrSlide: 6,
    distanceBetweenItems: spacing.spacingUnit,
    margin: spacing.spacingUnit * 3.5,
    arrowOffset: 0,
  },
];

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
  language: PropTypes.oneOf(['nb', 'nn', 'en']).isRequired,
  resourceTypeSelected: PropTypes.string,
  loadingPlaceholderHeight: PropTypes.bool,
};

export default injectT(MovieCategory);
