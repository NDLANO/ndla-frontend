/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn, Spinner } from '@ndla/ui';
// @ts-ignore
import Pager from '@ndla/pager';
import { RouteComponentProps } from 'react-router';
import { useLazyQuery } from '@apollo/client';
import queryString from 'query-string';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import { AudioSearch, SearchObject } from '../../interfaces';
import { podcastSearchQuery } from '../../queries';
import Podcast from './Podcast';

interface Props {
  locale: string;
}

const PodcastListPage: React.FC<Props & RouteComponentProps> = ({
  locale,
  location,
  history,
}) => {
  const [getPodcasts, { error, loading, data }] = useLazyQuery<AudioSearch>(
    podcastSearchQuery,
    {
      fetchPolicy: 'no-cache',
    },
  );
  const [totalCount, setTotalCount] = React.useState(1);
  const searchObject = queryString.parse(location.search);

  const page =
    (typeof searchObject.page === 'string' && searchObject.page) || '1';
  const pageSize =
    (typeof searchObject['page-size'] === 'string' &&
      searchObject['page-size']) ||
    '5';

  const onQueryPush = (newSearchObject: SearchObject) => {
    const oldSearchObject = queryString.parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach(
      key => searchQuery[key] === '' && delete searchQuery[key],
    );
    history.push(`/podcast?${queryString.stringify(searchQuery)}`);
    getPodcasts({
      variables: {
        page: searchQuery.page.toString(),
        pageSize: searchQuery['page-size'] || '5',
      },
    });
  };

  React.useEffect(() => {
    getPodcasts({
      variables: {
        page: searchObject.page || '1',
        pageSize: searchObject['page-size'] || '5',
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const newTotalCount = data?.podcastSearch.totalCount;
    if (newTotalCount) {
      setTotalCount(newTotalCount);
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
          page={parseInt(page, 10)}
          lastPage={Math.ceil(totalCount / parseInt(pageSize, 10))}
          pageItemComponentClass="button"
          query={searchObject}
          onClick={onQueryPush}
        />
      </OneColumn>
    </div>
  );
};

export default PodcastListPage;
