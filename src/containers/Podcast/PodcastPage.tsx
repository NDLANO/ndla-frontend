/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
// @ts-ignore
import { Spinner } from '@ndla/ui';
import { Redirect } from 'react-router-dom';

import { RouteComponentProps } from 'react-router';
import { useGraphQuery } from '../../util/runQueries';
import { podcastQuery } from '../../queries';
import Podcast from './Podcast';

type RouteParams = { id: string };

const PodcastPage: React.FC<RouteComponentProps<RouteParams>> = ({
  match: {
    params: { id },
  },
}) => {
  const { error, loading, data: { podcast } = {} } = useGraphQuery(
    podcastQuery,
    {
      variables: { id },
    },
  );

  if (error) {
    return <Redirect to="/podcast" />;
  }

  return (
    <div>
      <OneColumn>
        {loading ? <Spinner /> : <Podcast podcast={podcast} />}
      </OneColumn>
    </div>
  );
};

export default PodcastPage;
