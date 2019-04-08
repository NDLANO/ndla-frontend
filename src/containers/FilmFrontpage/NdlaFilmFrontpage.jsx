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

import handleError from '../../util/handleError';

class NdlaFilm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      moviesByType: [],
      fetchingMoviesByType: false,
    };
    this.onSelectedMovieByType = this.onSelectedMovieByType.bind(this);
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

    this.setState({
      fetchingMoviesByType: false,
      moviesByType: await this.fetchMoviesByType(resourceId),
    });
  };

  transformMoviesByType(movie) {
    const path = movie.contexts.find(
      context => context.learningResourceType === 'topic-article',
    ).path;

    const resourceTypes = movie.contexts.flatMap(
      context => context.resourceTypes,
    );

    return {
      ...movie,
      url: path,
      resourceTypes: resourceTypes,
    };
  }

  fetchMoviesByType = async resourceId => {
    try {
      const { data } = await runQueries(this.props.client, [
        {
          query: searchQuery,
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
    const { t } = this.props;
    const { filmfrontpage, subject } = this.props.data;

    const movieResourceTypes = [
      {
        name: t('filmfrontpage.resourcetype.documentary'),
        id: 'urn:resourcetype:documentary',
      },
      {
        name: t('filmfrontpage.resourcetype.featureFilm'),
        id: 'urn:resourcetype:featureFilm',
      },
      {
        name: t('filmfrontpage.resourcetype.series'),
        id: 'urn:resourcetype:series',
      },
      {
        name: t('filmfrontpage.resourcetype.shortFilm'),
        id: 'urn:resourcetype:shortFilm',
      },
    ];

    return (
      <FilmFrontpage
        highlighted={filmfrontpage ? filmfrontpage.slideShow : []}
        themes={filmfrontpage ? filmfrontpage.movieThemes : []}
        moviesByType={moviesByType}
        topics={subject ? subject.topics : []}
        resourceTypes={movieResourceTypes}
        onSelectedMovieByType={this.onSelectedMovieByType}
        aboutNDLAVideo={<img src={''} alt="example of video" />}
        fetchingMoviesByType={fetchingMoviesByType}
        moreAboutNdlaFilm={
          <>
            <h1>{t('filmfrontpage.moreAboutNdlaFilm.header')}</h1>
            <hr />
            <p>{t('filmfrontpage.moreAboutNdlaFilm.firstParagraph')}</p>
            <p>{t('filmfrontpage.moreAboutNdlaFilm.secondParagraph')}</p>
            <p>{t('filmfrontpage.moreAboutNdlaFilm.thirdParagraph')}</p>
            <h2>{t('filmfrontpage.moreAboutNdlaFilm.secondHeading')}</h2>
            <p>{t('filmfrontpage.moreAboutNdlaFilm.fourthParagraph')}</p>
            <p>{t('filmfrontpage.moreAboutNdlaFilm.fifthParagraph')}</p>
            <p>
              {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt1')}{' '}
              <a
                href="https://www.facebook.com/NDLAfilm/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('filmfrontpage.moreAboutNdlaFilm.ariaLabel')}>
                {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt2')}
              </a>{' '}
              {t('filmfrontpage.moreAboutNdlaFilm.tipSectionPt3')}
            </p>
            <p>
              <strong>{t('filmfrontpage.moreAboutNdlaFilm.ending')}</strong>
            </p>
          </>
        }
        language="nb"
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
};

export default compose(
  withApollo,
  injectT,
)(NdlaFilm);
