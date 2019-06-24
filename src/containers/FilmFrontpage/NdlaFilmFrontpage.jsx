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
  searchFilmQuery,
} from '../../queries';
import {
  GraphQLFilmFrontpageShape,
  GraphqlErrorShape,
  GraphQLSubjectShape,
} from '../../graphqlShapes';
import { movieResourceTypes } from './resourceTypes';
import handleError from '../../util/handleError';
import MoreAboutNdlaFilm from './MoreAboutNdlaFilm';

class NdlaFilm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesByType: [],
      fetchingMoviesByType: false,
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

  fetchMoviesByType = async resourceId => {
    try {
      const { data } = await runQueries(this.props.client, [
        {
          query: searchFilmQuery,
          variables: {
            subjects: 'urn:subject:20',
            resourceTypes: resourceId,
            pageSize: '100',
            contextTypes: 'topic-article',
          },
        },
      ]);
      return data.search.results.map(this.transformMoviesByType);
    } catch (error) {
      handleError(error);
      return { error: true };
    }
  };

  render() {
    const { moviesByType, fetchingMoviesByType } = this.state;
    const {
      t,
      locale,
      data: { filmfrontpage, subject },
      skipToContentId,
    } = this.props;
    const about =
      filmfrontpage &&
      filmfrontpage.about.find(about => (about.language = locale));

    return (
      <FilmFrontpage
        highlighted={filmfrontpage && filmfrontpage.slideShow}
        themes={filmfrontpage && filmfrontpage.movieThemes}
        moviesByType={moviesByType}
        topics={subject && subject.topics}
        resourceTypes={movieResourceTypes.map(resourceType => ({
          ...resourceType,
          name: t(resourceType.name),
        }))}
        onSelectedMovieByType={this.onSelectedMovieByType}
        aboutNDLAVideo={about}
        fetchingMoviesByType={fetchingMoviesByType}
        moreAboutNdlaFilm={<MoreAboutNdlaFilm />}
        language={locale}
        skipToContentId={skipToContentId}
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
