import React from 'react';
import { AudioPlayer, Figure, OneColumn } from '@ndla/ui';
import { RouteComponentProps } from 'react-router';
import { useGraphQuery } from '../../util/runQueries';
import { podcastQuery } from '../../queries';

type RouteParams = { podcastId: string };

const PodcastPage = ({
  match: {
    params: { podcastId },
  },
}: RouteComponentProps<RouteParams>) => {
  // eslint-disable-next-line no-empty-pattern
  const { data } = useGraphQuery(podcastQuery, {
    variables: { podcastId },
  });

  console.log(data);

  return (
    <div>
      <OneColumn>
        <Figure id={podcastId} type="full-column">
          <AudioPlayer
            src=""
            title=""
            description=""
            img={{
              url: '',
              alt: '',
            }}
            textVersion={''}
          />
        </Figure>
      </OneColumn>
    </div>
  );
};

export default PodcastPage;
