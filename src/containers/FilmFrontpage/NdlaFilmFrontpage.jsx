/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectT } from '@ndla/i18n';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';

import FilmFrontpage from './FilmFrontpage';
import {
  subjectPageQuery,
  filmFrontPageQuery,
  searchFilmQuery,
} from '../../queries';
import { movieResourceTypes } from './resourceTypes';
import MoreAboutNdlaFilm from './MoreAboutNdlaFilm';

const ALL_MOVIES_ID = 'ALL_MOVIES_ID';

const NdlaFilm = ({ t, locale, skipToContentId }) => {
  const [state, setState] = useState({
    moviesByType: [],
    showingAll: false,
    fetchingMoviesByType: false,
  });

  const { data: { filmfrontpage } = {} } = useQuery(filmFrontPageQuery);
  const { data: { subject } = {} } = useQuery(subjectPageQuery, {
    variables: { subjectId: 'urn:subject:20', filterIds: '' },
  });
  const [searchAllMovies, { data: allMovies }] = useLazyQuery(searchFilmQuery);

  useEffect(() => {
    // if we receive new movies we map them into state
    if (allMovies) {
      setState({
        ...state,
        moviesByType: allMovies.searchWithoutPagination.results.map(
          transformMoviesByType,
        ),
        fetchingMoviesByType: false,
      });
    }
  }, [allMovies]);

  const onSelectedMovieByType = resourceId => {
    const showingAll = resourceId === ALL_MOVIES_ID;
    setState({
      ...state,
      fetchingMoviesByType: true,
      showingAll,
    });

    const resourceTypes = showingAll
      ? movieResourceTypes.map(resourceType => resourceType.id).toString()
      : resourceId;

    searchAllMovies({
      variables: {
        subjects: 'urn:subject:20',
        resourceTypes,
        contextTypes: 'topic-article',
      },
    });
  };

  const transformMoviesByType = movie => {
    const contexts = movie.contexts.filter(
      context => context.learningResourceType === 'topic-article',
    );

    const { path } = contexts.length > 0 ? contexts[0] : {};

    return {
      ...movie,
      path,
      resourceTypes: contexts.flatMap(context => context.resourceTypes),
    };
  };

  const { moviesByType, showingAll, fetchingMoviesByType } = state;

  const about =
    filmfrontpage &&
    filmfrontpage.about.find(about => about.language === locale);

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
      onSelectedMovieByType={onSelectedMovieByType}
      aboutNDLAVideo={about}
      fetchingMoviesByType={fetchingMoviesByType}
      moreAboutNdlaFilm={<MoreAboutNdlaFilm />}
      locale={locale}
      skipToContentId={skipToContentId}
    />
  );
};

NdlaFilm.propTypes = {
  editor: PropTypes.bool,
  locale: PropTypes.string,
  skipToContentId: PropTypes.string,
};

export default injectT(NdlaFilm);
