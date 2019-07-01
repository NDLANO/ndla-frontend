/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { injectT } from '@ndla/i18n';
import { withApollo } from 'react-apollo';
import FilmFrontpage from './FilmFrontpage';
import { runQueries } from '../../util/runQueries';
import {
  subjectPageQuery,
  filmFrontPageQuery,
  searchQuery,
} from '../../queries';
import {
  GraphQLFilmFrontpageShape,
  GraphqlErrorShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { movieResourceTypes } from './resourceTypes';
import handleError from '../../util/handleError';
import MoreAboutNdlaFilm from './MoreAboutNdlaFilm';

const ALL_MOVIES_ID = 'ALL_MOVIES_ID';

class NdlaFilm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesByType: [],
      fetchingMoviesByType: false,
      showingAll: false,
    };
  }

  static async getInitialProps(ctx) {
    const { client } = ctx;
    return runQueries(client, [
      {
        query: filmFrontPageQuery,
      },
      {
        query: subjectPageQuery,
        variables: { subjectId: 'urn:subject:20', filterIds: '' },
      },
    ]);
  }

  onSelectedMovieByType = async resourceId => {
    this.setState({
      fetchingMoviesByType: true,
      showingAll: resourceId === ALL_MOVIES_ID,
    });

    const moviesFetched = await this.fetchMoviesByType(resourceId);

    this.setState({
      fetchingMoviesByType: false,
      moviesByType: moviesFetched,
    });
  };

  transformMoviesByType(movie) {
    const contexts = movie.contexts.filter(
      context => context.learningResourceType === 'topic-article',
    );

    const { path } = contexts.length > 0 ? contexts[0] : {};

    return {
      ...movie,
      path,
      resourceTypes: contexts.flatMap(context => context.resourceTypes),
    };
  }

  searchMovies = async (useResourceType, page, pageSize) =>
    await runQueries(this.props.client, [
      {
        query: searchQuery,
        variables: {
          subjects: 'urn:subject:20',
          resourceTypes: useResourceType,
          pageSize: pageSize.toString(),
          page: page.toString(),
          contextTypes: 'topic-article',
        },
      },
    ]);

  fetchMoviesByType = async resourceId => {
    const resourceTypes =
      resourceId === ALL_MOVIES_ID
        ? movieResourceTypes.map(resourceType => resourceType.id).toString()
        : resourceId;

    try {
      // Search doesnt support large pageSize, use multiple searches to list all.
      let needToFetchData = true;
      let page = 1;
      const pageSize = 100;
      const results = [];
      while (needToFetchData) {
        const fetchedData = await this.searchMovies(
          resourceTypes,
          page,
          pageSize,
        );
        results.push(...fetchedData.data.search.results);
        page += 1;
        needToFetchData = results.length < fetchedData.data.search.totalCount;
      }
      return results.map(this.transformMoviesByType);
    } catch (error) {
      handleError(error);
      return { error: true };
    }
  };

  render() {
    const { moviesByType, fetchingMoviesByType, showingAll } = this.state;
    const { t, locale } = this.props;
    const { filmfrontpage, subject } = this.props.data;
    const about =
      filmfrontpage &&
      filmfrontpage.about.find(about => (about.language = locale));
    const allResources = {
      name: t('filmfrontpage.resourcetype.all'),
      id: ALL_MOVIES_ID,
    };

    return (
      <FilmFrontpage
        showingAll={showingAll}
        highlighted={filmfrontpage && filmfrontpage.slideShow}
        themes={filmfrontpage && filmfrontpage.movieThemes}
        moviesByType={moviesByType}
        topics={subject && subject.topics}
        resourceTypes={[
          ...movieResourceTypes.map(resourceType => ({
            ...resourceType,
            name: t(resourceType.name),
          })),
          ...[allResources],
        ]}
        onSelectedMovieByType={this.onSelectedMovieByType}
        aboutNDLAVideo={about}
        fetchingMoviesByType={fetchingMoviesByType}
        moreAboutNdlaFilm={<MoreAboutNdlaFilm />}
        locale={locale}
      />
    );
  }
}

NdlaFilm.propTypes = {
  editor: PropTypes.bool,
  data: PropTypes.shape({
    filmfrontpage: GraphQLFilmFrontpageShape,
    subject: GraphQLSubjectShape,
    error: GraphqlErrorShape,
  }),
  client: PropTypes.shape({ query: PropTypes.func.isRequired }).isRequired,
  locale: PropTypes.string,
};

export default compose(
  withApollo,
  injectT,
)(NdlaFilm);
