/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { css } from '@emotion/core';
import { spacingUnit } from '@ndla/core';
import {
  FilmSlideshow,
  AboutNdlaFilm,
  FilmMovieSearch,
  AllMoviesAlphabetically,
} from '@ndla/ui';

import MovieCategory from './MovieCategory';
import {
  GraphQLTopicShape,
  GraphQLArticleMetaShape,
  GraphQLMovieThemeShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { htmlTitle } from '../../util/titleHelper';

const ARIA_FILMCATEGORY_ID = 'movieCategoriesId';

const sortAlphabetically = (movies, locale) =>
  movies.sort((a, b) => a.title.localeCompare(b.title, locale));

class FilmFrontpage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resourceTypeSelected: null,
    };
    this.onChangeResourceType = this.onChangeResourceType.bind(this);
    this.movieListRef = React.createRef();
  }

  static getDocumentTitle({ t, subject }) {
    return htmlTitle(subject?.name, [t('htmlTitles.titleTemplate')]);
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

  render() {
    const {
      highlighted,
      resourceTypes,
      t,
      subject,
      topics,
      aboutNDLAVideo,
      moviesByType,
      moreAboutNdlaFilm,
      showingAll,
      skipToContentId,
      themes,
      locale,
      fetchingMoviesByType,
    } = this.props;
    const { resourceTypeSelected, loadingPlaceholderHeight } = this.state;

    const resourceTypeName =
      resourceTypeSelected &&
      resourceTypes.find(
        resourceType => resourceType.id === resourceTypeSelected,
      );
    return (
      <div id={skipToContentId}>
        <Helmet>
          <title>{`${this.constructor.getDocumentTitle({
            t,
            subject,
          })}`}</title>
          {aboutNDLAVideo && aboutNDLAVideo.description && (
            <meta name="description" content={aboutNDLAVideo.description} />
          )}
        </Helmet>
        <FilmSlideshow slideshow={highlighted} />
        <FilmMovieSearch
          ariaControlId={ARIA_FILMCATEGORY_ID}
          topics={topics}
          resourceTypes={resourceTypes}
          resourceTypeSelected={resourceTypeName}
          onChangeResourceType={this.onChangeResourceType}
        />
        <div
          ref={this.movieListRef}
          css={css`
            margin: ${spacingUnit * 3}px 0 ${spacingUnit * 4}px;
          `}>
          {showingAll ? (
            <AllMoviesAlphabetically
              movies={sortAlphabetically(moviesByType, locale)}
              locale={locale}
            />
          ) : (
            <MovieCategory
              resourceTypeName={resourceTypeName}
              moviesByType={moviesByType}
              resourceTypes={resourceTypes}
              themes={themes}
              fetchingMoviesByType={fetchingMoviesByType}
              language={locale}
              resourceTypeSelected={resourceTypeSelected}
              loadingPlaceholderHeight={loadingPlaceholderHeight}
            />
          )}
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

FilmFrontpage.propTypes = {
  fetchingMoviesByType: PropTypes.bool,
  moviesByType: PropTypes.arrayOf(GraphQLArticleMetaShape),
  highlighted: PropTypes.arrayOf(GraphQLArticleMetaShape),
  themes: PropTypes.arrayOf(GraphQLMovieThemeShape),
  subject: GraphQLSubjectShape,
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
    language: PropTypes.string,
    visualElement: PropTypes.shape({
      type: PropTypes.string,
      url: PropTypes.string,
      alt: PropTypes.string,
    }),
  }),
  locale: PropTypes.oneOf(SUPPORTED_LANGUAGES).isRequired,
  moreAboutNdlaFilm: PropTypes.any,
  showingAll: PropTypes.bool,
  skipToContentId: PropTypes.string,
};

FilmFrontpage.defaultProps = {
  moviesByType: [],
  themes: [],
  movieThemes: [],
  resourceTypes: [],
  topics: [],
};

export default FilmFrontpage;
