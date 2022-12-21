import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { ContentPlaceholder, OneColumn } from '@ndla/ui';
import { initArticleScripts } from '@ndla/article-scripts';
import { useGraphQuery } from '../../util/runQueries';
import { GQLPodcast_AudioFragment } from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import { podcastQuery } from '../../queries';
import Podcast from '../../containers/PodcastPage/Podcast';

type QueryData = {
  podcast: GQLPodcast_AudioFragment;
};

const AudioPage = () => {
  const { audioId } = useParams();
  const { data, loading, error } = useGraphQuery<QueryData>(podcastQuery, {
    variables: {
      id: Number.parseInt(audioId ?? ''),
    },
    skip: !audioId,
  });

  useEffect(() => {
    initArticleScripts();
  }, [loading]);

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data?.podcast) {
    return <NotFoundPage />;
  }

  return (
    <OneColumn>
      <Podcast podcast={data.podcast} />
    </OneColumn>
  );
};

export default AudioPage;
