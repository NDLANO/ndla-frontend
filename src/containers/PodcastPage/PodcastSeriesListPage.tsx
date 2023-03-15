/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { OneColumn } from '@ndla/ui';
import { Spinner } from '@ndla/icons';
import Pager from '@ndla/pager';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { gql, useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { parse, stringify } from 'query-string';
import { HelmetWithTracker } from '@ndla/tracker';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { GQLPodcastSeriesListPageQuery } from '../../graphqlTypes';
import PodcastSeries from './PodcastSeries';
import { useGraphQuery } from '../../util/runQueries';

type SearchObject = {
  page: string;
  'page-size': string;
};

export const getPageSize = (searchObject: SearchObject) => {
  return Number(searchObject['page-size']) || 5;
};
export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const StyledTitle = styled.div`
  display: flex;
  margin-top: ${spacing.small};
  align-items: baseline;
  h1 {
    margin-bottom: 0;
  }
`;

const StyledTitlePageInfo = styled.span`
  margin: 0 ${spacing.small};
`;

const NoResult = styled.div`
  margin: ${spacing.normal} ${spacing.xxsmall};
`;

const PodcastSeriesListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const searchObject = parse(location.search);

  const page = getPage(searchObject);
  const pageSize = getPageSize(searchObject);

  const apolloClient = useApolloClient();

  const { error, loading, data, previousData } =
    useGraphQuery<GQLPodcastSeriesListPageQuery>(podcastSeriesListPageQuery, {
      variables: {
        page: page,
        pageSize: pageSize,
        fallback: true,
      },
    });

  const results = data?.podcastSeriesSearch?.results;

  const lastPage = Math.ceil(
    (data?.podcastSeriesSearch?.totalCount ??
      previousData?.podcastSeriesSearch?.totalCount ??
      0) / pageSize,
  );

  useEffect(() => {
    const nextPage = page + 1;
    if (nextPage <= pageSize) {
      apolloClient.query({
        query: podcastSeriesListPageQuery,
        variables: {
          page: nextPage,
          pageSize: pageSize,
          fallback: true,
        },
      });
    }
  }, [page, pageSize, apolloClient]);

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(
      (key) => searchQuery[key] === '' && delete searchQuery[key],
    );
    navigate(`/podkast?${stringify(searchQuery)}`);
  };

  if (!data && !loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <HelmetWithTracker title={t('htmlTitles.podcast', { page: page })} />
      <OneColumn>
        <StyledTitle>
          <h1>{t('podcastPage.podcasts')}</h1>
          {(!!data || !!previousData) && (
            <StyledTitlePageInfo>
              {t('podcastPage.pageInfo', { page, lastPage })}
            </StyledTitlePageInfo>
          )}
        </StyledTitle>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {results?.length ? (
              results.map((series) => {
                return (
                  <PodcastSeries key={`podcast-${series.id}`} {...series} />
                );
              })
            ) : (
              <NoResult>{t('podcastPage.noResults')}</NoResult>
            )}
          </div>
        )}
        <Pager
          page={getPage(searchObject)}
          lastPage={lastPage}
          pageItemComponentClass="button"
          query={searchObject}
          onClick={onQueryPush}
        />
      </OneColumn>
    </>
  );
};

const podcastSeriesListPageQuery = gql`
  ${PodcastSeries.fragments.series}
  query podcastSeriesListPage(
    $page: Int!
    $pageSize: Int!
    $fallback: Boolean
  ) {
    podcastSeriesSearch(page: $page, pageSize: $pageSize, fallback: $fallback) {
      results {
        ...PodcastSeries_PodcastSeriesSummary
      }
      totalCount
    }
  }
`;

export default PodcastSeriesListPage;
