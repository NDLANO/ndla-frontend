/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import FilmFrontpage from './FilmFrontpage';
import {
  subjectPageQuery,
  filmFrontPageQuery,
  searchFilmQuery,
} from '../../queries';
import { movieResourceTypes } from './resourceTypes';
import MoreAboutNdlaFilm from './MoreAboutNdlaFilm';
import { useGraphQuery } from '../../util/runQueries';

const ALL_MOVIES_ID = 'ALL_MOVIES_ID';

const NdlaFilm = ({ locale, skipToContentId }) => {
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    moviesByType: [],
    showingAll: false,
    fetchingMoviesByType: false,
  });

  const { data: { filmfrontpage } = {} } = useGraphQuery(filmFrontPageQuery);
  const { data: { subject } = {} } = useGraphQuery(subjectPageQuery, {
    variables: { subjectId: 'urn:subject:20' },
  });
  const [searchAllMovies, { data: allMovies }] = useLazyQuery(searchFilmQuery, {
    variables: { language: i18n.language, fallback: 'true' },
  });

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
  }, [allMovies]); // eslint-disable-line react-hooks/exhaustive-deps

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
        contextTypes: 'standard',
      },
    });
  };

  const transformMoviesByType = movie => {
    const contexts = movie.contexts.filter(
      context => context.learningResourceType === 'standard',
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
      t={t}
      subject={subject}
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

export default NdlaFilm;
