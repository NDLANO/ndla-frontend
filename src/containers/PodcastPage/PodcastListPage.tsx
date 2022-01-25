import React, { useEffect } from 'react';
import { OneColumn, Spinner } from '@ndla/ui';
import Pager from '@ndla/pager';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useLazyQuery } from '@apollo/client';
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

export const getPageSize = (searchObject: SearchObject): string => {
  return searchObject['page-size'] || '5';
};
export const getPage = (searchObject: SearchObject): string => {
  return searchObject.page || '1';
};

const PodcastListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [getPodcasts, { error, loading, data }] = useLazyQuery<
    GQLPodcastSearchQueryQuery
  >(podcastSearchQuery);
  const searchObject = parse(location.search);

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
    getPodcasts({
      variables: {
        page: searchQuery.page.toString(),
        pageSize: getPageSize(searchQuery),
      },
    });
  };

  useEffect(() => {
    getPodcasts({
      variables: {
        page: getPage(searchObject),
        pageSize: getPageSize(searchObject),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        {loading ? (
          <Spinner />
        ) : (
          data?.podcastSearch?.results &&
          data.podcastSearch.results.map(podcast => (
            <Podcast podcast={podcast} />
          ))
        )}
        <Pager
          page={parseInt(getPage(searchObject), 10)}
          lastPage={Math.ceil(
            (data?.podcastSearch?.totalCount ?? 0) /
              parseInt(getPageSize(searchObject), 10),
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
