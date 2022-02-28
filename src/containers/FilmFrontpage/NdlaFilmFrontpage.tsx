/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { useTranslation } from 'react-i18next';
import FilmFrontpage from './FilmFrontpage';
import {
  subjectPageQuery,
  filmFrontPageQuery,
  searchFilmQuery,
} from '../../queries';
import { movieResourceTypes } from './resourceTypes';
import { useGraphQuery } from '../../util/runQueries';
import {
  GQLFilmFrontPageQuery,
  GQLSearchWithoutPaginationQuery,
  GQLSubjectPageQuery,
} from '../../graphqlTypes';

const ALL_MOVIES_ID = 'ALL_MOVIES_ID';

interface Props {
  skipToContentId?: string;
}

export type MoviesByType = {
  id: number;
  metaDescription: string;
  resourceTypes: { id: string; name: string }[];
  metaImage?: { alt: string; url: string };
  path: string;
  title: string;
};

const NdlaFilm = ({ skipToContentId }: Props) => {
  const [moviesByType, setMoviesByType] = useState<MoviesByType[]>([]);
  const [showingAll, setShowingAll] = useState(false);
  const [fetchingMoviesByType, setFetchingMoviesByType] = useState(false);
  const { t, i18n } = useTranslation();

  const { data: { filmfrontpage } = {} } = useGraphQuery<GQLFilmFrontPageQuery>(
    filmFrontPageQuery,
  );
  const { data: { subject } = {} } = useGraphQuery<GQLSubjectPageQuery>(
    subjectPageQuery,
    { variables: { subjectId: 'urn:subject:20' } },
  );
  const [searchAllMovies, { data: allMovies }] = useLazyQuery<
    GQLSearchWithoutPaginationQuery
  >(searchFilmQuery, {
    variables: { language: i18n.language, fallback: 'true' },
  });

  useEffect(() => {
    // if we receive new movies we map them into state
    if (allMovies) {
      const byType = allMovies.searchWithoutPagination?.results?.map(movie => {
        const contexts = movie.contexts.filter(
          ctx => ctx.learningResourceType === 'standard',
        );
        return {
          ...movie,
          path: contexts[0]?.path ?? '',
          resourceTypes: contexts.flatMap(ctx => ctx.resourceTypes),
        };
      });

      setMoviesByType(byType ?? []);
      setFetchingMoviesByType(false);
    }
  }, [allMovies]); // eslint-disable-line react-hooks/exhaustive-deps

  const onSelectedMovieByType = (resourceId: string) => {
    const showingAll = resourceId === ALL_MOVIES_ID;
    setShowingAll(showingAll);
    setFetchingMoviesByType(true);

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

  const about = filmfrontpage?.about?.find(
    about => about.language === i18n.language,
  );

  const allResources = {
    name: t('filmfrontpage.resourcetype.all'),
    id: ALL_MOVIES_ID,
  };

  const allResourceTypes = movieResourceTypes
    .map(rt => ({ ...rt, name: t(rt.name) }))
    .concat([allResources]);

  return (
    <FilmFrontpage
      filmFrontpage={filmfrontpage}
      showingAll={showingAll}
      moviesByType={moviesByType}
      subject={subject}
      resourceTypes={allResourceTypes}
      onSelectedMovieByType={onSelectedMovieByType}
      aboutNDLAVideo={about}
      fetchingMoviesByType={fetchingMoviesByType}
      skipToContentId={skipToContentId}
    />
  );
};

export default NdlaFilm;
