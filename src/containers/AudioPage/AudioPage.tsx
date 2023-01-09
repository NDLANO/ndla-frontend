/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useParams } from 'react-router-dom';
import { ContentPlaceholder, OneColumn } from '@ndla/ui';
import { gql } from '@apollo/client';
import { useGraphQuery } from '../../util/runQueries';
import { GQLAudioQuery, GQLAudioQueryVariables } from '../../graphqlTypes';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import Audio from '../../containers/PodcastPage/Audio';

const AudioPage = () => {
  const { audioId } = useParams();
  const { data, loading, error } = useGraphQuery<
    GQLAudioQuery,
    GQLAudioQueryVariables
  >(audioPageQuery, {
    variables: {
      id: Number.parseInt(audioId ?? ''),
    },
    skip: Number.isNaN(audioId),
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (!data?.audio) {
    return <NotFoundPage />;
  }

  return (
    <OneColumn>
      <Audio audio={data.audio} />
    </OneColumn>
  );
};

const audioPageQuery = gql`
  ${Audio.fragments.audio}
  query audio($id: Int!) {
    audio(id: $id) {
      ...Podcast_Audio
    }
  }
`;

export default AudioPage;
