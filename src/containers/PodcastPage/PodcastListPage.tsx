import React, { useEffect } from 'react';
import { OneColumn, Spinner } from '@ndla/ui';
import Pager from '@ndla/pager';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useApolloClient, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { parse, stringify } from 'query-string';
import { HelmetWithTracker } from '@ndla/tracker';
import { podcastSearchQuery } from '../../queries';
import Podcast from './Podcast';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { GQLPodcastSearchQueryQuery } from '../../graphqlTypes';

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
  align-items: baseline;
`;

const StyledTitlePageInfo = styled.span`
  margin: 0 ${spacing.small};
`;

const PodcastListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const searchObject = parse(location.search);

  const page = getPage(searchObject);
  const pageSize = getPageSize(searchObject);
  const apolloClient = useApolloClient();

  const { error, loading, data } = useQuery<GQLPodcastSearchQueryQuery>(
    podcastSearchQuery,
    {
      variables: {
        page: page.toString(),
        pageSize: pageSize.toString(),
      },
    },
  );

  useEffect(() => {
    const nextPage = page + 1;
    if (nextPage <= pageSize) {
      apolloClient.query({
        query: podcastSearchQuery,
        variables: {
          page: nextPage.toString(),
          pageSize: pageSize.toString(),
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
    history.push(`/podcast?${stringify(searchQuery)}`);
  };

  if (!data && !loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <HelmetWithTracker
        title={t('htmlTitles.podcast', { page: searchObject.page || '1' })}
      />
      <OneColumn>
        <StyledTitle>
          <h1>Podcaster</h1>{' '}
          <StyledTitlePageInfo>
            side {page} av {pageSize}
          </StyledTitlePageInfo>
        </StyledTitle>
        {loading ? (
          <Spinner />
        ) : (
          data?.podcastSearch?.results &&
          data.podcastSearch.results.map(podcast => (
            <Podcast podcast={podcast} />
          ))
        )}
        <Pager
          page={getPage(searchObject)}
          lastPage={Math.ceil(
            (data?.podcastSearch?.totalCount ?? 0) / getPageSize(searchObject),
          )}
          pageItemComponentClass="button"
          query={searchObject}
          onClick={onQueryPush}
        />
      </OneColumn>
    </>
  );
};

export default PodcastListPage;
