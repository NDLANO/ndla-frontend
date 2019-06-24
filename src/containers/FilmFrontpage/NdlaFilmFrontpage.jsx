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

const sortAlphabetically = movies =>
  movies.sort((a, b) => a.title.localeCompare(b.title));

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
      moviesByType: sortAlphabetically(moviesFetched),
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

  queryBatch = async (useResourceType, page, pageSize) =>
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
    const useResourceType =
      resourceId === ALL_MOVIES_ID
        ? movieResourceTypes.map(resourceType => resourceType.id).toString()
        : resourceId;

    try {
      // 1. Search doesnt support large pageSize, use multiple searches to list all.
      // 2. Search returns same movie multiple times (useResourceType === list of resourceTypes).
      let needToFetchData = true;
      let page = 0;
      const pageSize = 100;
      const results = [];
      while (needToFetchData) {
        const fetchedData = await this.queryBatch(
          useResourceType,
          page,
          pageSize,
        );
        results.push(...fetchedData.data.search.results);
        page += 1;
        needToFetchData = page * pageSize < fetchedData.data.search.totalCount;
      }
      const transformedResults = results.map(this.transformMoviesByType);
      const filterIds = {};
      return transformedResults.filter(result => {
        if (!filterIds[result.id]) {
          filterIds[result.id] = true;
          return true;
        }
        return false;
      });
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
        language={locale}
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
