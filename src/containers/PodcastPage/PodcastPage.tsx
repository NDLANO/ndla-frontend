import React from 'react';
import { OneColumn } from '@ndla/ui';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { podcastQuery } from '../../queries';
import Podcast from './Podcast';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { LocaleType } from '.../../../interfaces';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { GQLAudio, GQLQuery } from '../../graphqlTypes';

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  locale: LocaleType;
  skipToContentId: string;
}

const PodcastPage = ({
  match: {
    params: { id },
  },
}: Props) => {
  const { error, loading, data: { podcast } = {} } = useQuery<GQLQuery>(
    podcastQuery,
    {
      variables: { id },
    },
  );

  const { t } = useTranslation();

  const getDocumentTitle = (podcast: GQLAudio) => {
    return `${podcast?.title?.title || 'Podcast'} - ${t(
      'htmlTitles.titleTemplate',
    )}`;
  };

  if (loading) {
    return null;
  }

  if (!podcast) {
    return <Redirect to="/podcast" />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  return (
    <>
      <HelmetWithTracker title={`${getDocumentTitle(podcast)}`}>
        {podcast?.podcastMeta?.introduction && (
          <meta name="description" content={podcast.podcastMeta.introduction} />
        )}
      </HelmetWithTracker>
      <SocialMediaMetadata
        title={podcast?.title.title ?? ''}
        trackableContent={{
          tags: podcast?.tags?.tags,
          supportedLanguages: podcast.supportedLanguages,
        }}
        description={podcast.podcastMeta?.introduction}
        image={
          podcast.podcastMeta?.coverPhoto && {
            url: podcast.podcastMeta.coverPhoto.url,
            alt: podcast.podcastMeta.coverPhoto.altText,
          }
        }
      />
      <OneColumn>
        <Podcast podcast={podcast} />
      </OneColumn>
    </>
  );
};

export default withRouter(PodcastPage);
