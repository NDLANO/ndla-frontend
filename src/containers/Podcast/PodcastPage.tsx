/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { useGraphQuery } from '../../util/runQueries';
import { podcastQuery } from '../../queries';
import Podcast from './Podcast';

type RouteParams = { id: string };

interface Props {
  locale: string;
}

const PodcastPage: React.FC<Props & RouteComponentProps<RouteParams>> = ({
  match: {
    params: { id },
  },
  locale,
}) => {
  const { loading, data: { podcast } = {} } = useGraphQuery(podcastQuery, {
    variables: { id },
  });

  if (loading) {
    return null;
  }

  if (!podcast) {
    return <Redirect to="/podcast" />;
  }

  return (
    <div>
      <OneColumn>
        <Podcast podcast={podcast} locale={locale} />
      </OneColumn>
    </div>
  );
};

export default PodcastPage;
