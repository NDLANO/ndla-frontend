/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
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
  const { loading, data: { podcast } = {} } = useGraphQuery(podcastQuery, {
    variables: { id },
  });

  return (
    <div>
      <OneColumn>
        {!loading && podcast ? (
          <div>
            <Podcast podcast={podcast} runScripts />
          </div>
        ) : (
          <div>loading</div>
        )}
      </OneColumn>
    </div>
  );
};

export default PodcastPage;
