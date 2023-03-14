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
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useGraphQuery } from '../../util/runQueries';
import { GQLAudioQuery, GQLAudioQueryVariables } from '../../graphqlTypes';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import NotFoundPage from '../../containers/NotFoundPage/NotFoundPage';
import Audio from '../../containers/PodcastPage/Audio';
import { StyledResourceHeader } from '../ImagePage/ImagePage';

const AudioPage = () => {
  const { audioId } = useParams();
  const { t } = useTranslation();
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

  const title = `${data?.audio?.title.title} - ${t(
    'resourcepageTitles.audio',
  )}`;

  return (
    <OneColumn>
      <HelmetWithTracker title={`${title} - NDLA`} />
      <SocialMediaMetadata
        type="website"
        title={title}
        audioUrl={data?.audio?.audioFile.url}>
        <meta name="robots" content="noindex" />
      </SocialMediaMetadata>
      <StyledResourceHeader id="SkipToContentId" tabIndex={-1}>
        {title}
      </StyledResourceHeader>
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
