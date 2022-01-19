import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { podcastQuery } from '../../queries';
import Podcast from './Podcast';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { Audio, LocaleType } from '.../../../interfaces';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

interface RouteParams {
  id?: string;
}

interface PodcastQuery {
  podcast: Audio;
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
  const { error, loading, data: { podcast } = {} } = useQuery<PodcastQuery>(
    podcastQuery,
    {
      variables: { id },
    },
  );

  const {
    i18n: { language },
    t,
  } = useTranslation();

  const getDocumentTitle = (podcast: Audio) => {
    return `${podcast?.title?.title || ''}${t('htmlTitles.titleTemplate')}`;
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
    <div>
      <Helmet>
        <title>{`${getDocumentTitle(podcast)}`}</title>
        {podcast?.podcastMeta?.introduction && (
          <meta name="description" content={podcast.podcastMeta.introduction} />
        )}
      </Helmet>
      <SocialMediaMetadata
        // @ts-ignore
        title={podcast?.title.title ?? ''}
        trackableContent={{
          tags: podcast.tags.tags,
          supportedLanguages: podcast.supportedLanguages,
        }}
        description={podcast.podcastMeta?.introduction}
        locale={language}
        image={
          podcast.podcastMeta?.coverPhoto && {
            url: podcast.podcastMeta.coverPhoto.url,
            alt: podcast.podcastMeta.coverPhoto.altText,
          }
        }
      />
      <OneColumn>
        <Podcast podcast={podcast} locale={language} />
      </OneColumn>
    </div>
  );
};

export default withRouter(PodcastPage);
