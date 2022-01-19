import React from 'react';
// @ts-ignore
import { OneColumn, Spinner } from '@ndla/ui';
// @ts-ignore
import Pager from '@ndla/pager';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router';
import { useLazyQuery } from '@apollo/client';
// @ts-ignore
import { parse, stringify } from 'query-string';
import { Helmet } from 'react-helmet';
import { AudioSearch, SearchObject } from '../../interfaces';
import { podcastSearchQuery } from '../../queries';
import Podcast from './Podcast';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

const DEFAULT_PAGE_SIZE = '5';

export const getPageSize = (searchObject: SearchObject): string => {
  return searchObject['page-size'] || DEFAULT_PAGE_SIZE;
};
export const getPage = (searchObject: SearchObject): string => {
  return searchObject.page || '1';
};

const PodcastListPage = () => {
  const {
    t,
    i18n: { language: locale },
  } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const [getPodcasts, { error, loading, data }] = useLazyQuery<AudioSearch>(
    podcastSearchQuery,
  );
  const [totalCount, setTotalCount] = React.useState(0);
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

  const getDocumentTitle = (searchObject: SearchObject) => {
    return `${t('htmlTitles.podcast')} - ${t(
      'htmlTitles.page',
    )} ${searchObject?.page || '1'}${t('htmlTitles.titleTemplate')}`;
  };

  React.useEffect(() => {
    getPodcasts({
      variables: {
        page: getPage(searchObject),
        pageSize: getPageSize(searchObject),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (data?.podcastSearch) {
      setTotalCount(data.podcastSearch.totalCount);
    }
  }, [data]);

  if (!data && !loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle(searchObject)}`}</title>
      </Helmet>
      <OneColumn>
        {loading ? (
          <Spinner />
        ) : (
          data &&
          data.podcastSearch.results.map(podcast => (
            <Podcast podcast={podcast} locale={locale} />
          ))
        )}
        <Pager
          page={parseInt(getPage(searchObject), 10)}
          lastPage={Math.ceil(
            totalCount / parseInt(getPageSize(searchObject), 10),
          )}
          pageItemComponentClass="button"
          query={searchObject}
          onClick={onQueryPush}
        />
      </OneColumn>
    </div>
  );
};

export default PodcastListPage;
