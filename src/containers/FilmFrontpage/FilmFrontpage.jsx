/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CarouselAutosize } from '@ndla/carousel';
import { spacing } from '@ndla/core';
import { injectT } from '@ndla/i18n';
import {
  FilmSlideshow,
  MovieGrid,
  AboutNdlaFilm,
  FilmMovieSearch,
  FilmMovieList,
} from '@ndla/ui';
import {
  GraphQLTopicShape,
  GraphQLArticleMetaShape,
  GraphQLMovieThemeShape,
} from '../../graphqlShapes';

const ARIA_FILMCATEGORY_ID = 'movieCategoriesId';

class FilmFrontpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypeSelected: null,
    };
    this.onChangeResourceType = this.onChangeResourceType.bind(this);
    this.movieListRef = React.createRef();
  }

  onChangeResourceType(resourceTypeSelected) {
    const loadingPlaceholderHeight = `${
      this.movieListRef.current.getBoundingClientRect().height
    }px`;

    if (resourceTypeSelected) {
      this.props.onSelectedMovieByType(resourceTypeSelected);
    }

    this.setState({
      resourceTypeSelected,
      loadingPlaceholderHeight,
    });
  }

  findName = (themeNames, language) => {
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

  render() {
    const {
      highlighted,
      themes,
      resourceTypes,
      topics,
      aboutNDLAVideo,
      moviesByType,
      fetchingMoviesByType,
      moreAboutNdlaFilm,
      skipToContentId,
      language,
      t,
    } = this.props;
    const { resourceTypeSelected, loadingPlaceholderHeight } = this.state;

    const resourceTypeName =
      resourceTypeSelected &&
      resourceTypes.find(
        resourceType => resourceType.id === resourceTypeSelected,
      );

    return (
      <div id={skipToContentId}>
        <FilmSlideshow slideshow={highlighted} />
        <FilmMovieSearch
          ariaControlId={ARIA_FILMCATEGORY_ID}
          topics={topics}
          resourceTypes={resourceTypes}
          resourceTypeSelected={resourceTypeName}
          onChangeResourceType={this.onChangeResourceType}
        />
        <div ref={this.movieListRef}>
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
                    name={this.findName(theme.name, language)}
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
        </div>
        {aboutNDLAVideo && (
          <AboutNdlaFilm
            aboutNDLAVideo={aboutNDLAVideo}
            moreAboutNdlaFilm={moreAboutNdlaFilm}
          />
        )}
      </div>
    );
  }
}

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

FilmFrontpage.propTypes = {
  fetchingMoviesByType: PropTypes.bool,
  moviesByType: PropTypes.arrayOf(GraphQLArticleMetaShape),
  highlighted: PropTypes.arrayOf(GraphQLArticleMetaShape),
  themes: PropTypes.arrayOf(GraphQLMovieThemeShape),
  topics: PropTypes.arrayOf(GraphQLTopicShape),
  resourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.id,
    }),
  ),
  onSelectedMovieByType: PropTypes.func.isRequired,
  aboutNDLAVideo: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    langugae: PropTypes.string,
    visualElement: PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
      alt: PropTypes.string,
    }),
  }).isRequired,
  language: PropTypes.oneOf(['nb', 'nn', 'en']).isRequired,
  moreAboutNdlaFilm: PropTypes.any,
  skipToContentId: PropTypes.string,
  t: PropTypes.func.isRequired,
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
};

FilmFrontpage.defaultProps = {
  moviesByType: [],
  themes: [],
  movieThemes: [],
  resourceTypes: [],
  topics: [],
};

export default injectT(FilmFrontpage);
