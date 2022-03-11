/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { OneColumn, Spinner } from '@ndla/ui';
import Pager from '@ndla/pager';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { parse, stringify } from 'query-string';
import { HelmetWithTracker } from '@ndla/tracker';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { GQLPodcastSeriesSearchQueryQuery } from '../../graphqlTypes';
import PodcastSeries from './PodcastSeries';

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
  const history = useHistory();
  const searchObject = parse(location.search);

  const page = getPage(searchObject);
  const pageSize = getPageSize(searchObject);

  const apolloClient = useApolloClient();

  const { error, loading, data, previousData } = useQuery<
    GQLPodcastSeriesSearchQueryQuery
  >(podcastSeriesSearchQuery, {
    variables: {
      page: page,
      pageSize: pageSize,
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
        query: podcastSeriesSearchQuery,
        variables: {
          page: nextPage,
          pageSize: pageSize,
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
      key => searchQuery[key] === '' && delete searchQuery[key],
    );
    history.push(`/podkast?${stringify(searchQuery)}`);
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
              results.map(series => {
                return <PodcastSeries {...series} />;
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

const podcastSeriesSearchQuery = gql`
  ${PodcastSeries.fragments.series}
  query podcastSeriesSearchQuery($page: Int!, $pageSize: Int!) {
    podcastSeriesSearch(page: $page, pageSize: $pageSize) {
      results {
        ...PodcastSeriesSummary
      }
      totalCount
    }
  }
`;

export default PodcastSeriesListPage;
