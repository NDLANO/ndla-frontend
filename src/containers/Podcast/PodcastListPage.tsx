/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
// @ts-ignore
import Pager from '@ndla/pager';
import { useQuery } from '@apollo/client';
import { AudioSearch } from '../../interfaces';
import { podcastSearchQuery } from '../../queries';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import Podcast from './Podcast';

interface Props {
  locale: string;
}

const PodcastListPage: React.FC<Props> = ({ locale }) => {
  const [page] = React.useState(1);
  const [pageSize] = React.useState(5);
  const { loading, data: { podcastSearch } = {} } = useQuery<AudioSearch>(
    podcastSearchQuery,
    {
      errorPolicy: 'all',
      variables: { page: '1', pageSize: '10' },
    },
  );

  if (loading) {
    return null;
  }

  if (!podcastSearch) {
    return <DefaultErrorMessage />;
  }

  return (
    <div>
      <OneColumn>
        {podcastSearch.results.map(podcast => (
          <Podcast podcast={podcast} locale={locale} />
        ))}
        <Pager
          page={page}
          lastPage={Math.ceil(podcastSearch.totalCount / pageSize)}
          pageItemComponentClass="button"
        />
      </OneColumn>
    </div>
  );
};

export default PodcastListPage;
