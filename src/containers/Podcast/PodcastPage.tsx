/* eslint-disable react/prop-types */
import React from 'react';
// @ts-ignore
import { OneColumn } from '@ndla/ui';
import { Redirect } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Helmet } from 'react-helmet';
import { injectT, tType } from '@ndla/i18n';
import { useQuery } from '@apollo/client';
import { podcastQuery } from '../../queries';
import Podcast from './Podcast';
import { DefaultErrorMessage } from '../../components/DefaultErrorMessage';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { Audio } from '.../../../interfaces';

type RouteParams = { id: string };

interface Props {
  locale: string;
}

interface PodcastQuery {
  podcast: Audio;
}

const PodcastPage: React.FC<Props &
  tType &
  RouteComponentProps<RouteParams>> = ({
  match: {
    params: { id },
  },
  locale,
  t,
}) => {
  const { error, loading, data: { podcast } = {} } = useQuery<PodcastQuery>(
    podcastQuery,
    {
      variables: { id },
    },
  );

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
        title={podcast?.title.title ? podcast?.title.title : ''}
        trackableContent={podcast}
        description={podcast.podcastMeta?.introduction}
        locale={locale}
        image={
          podcast.podcastMeta?.coverPhoto && {
            url: podcast.podcastMeta.coverPhoto.url,
            alt: podcast.podcastMeta.coverPhoto.altText,
          }
        }
      />
      <OneColumn>
        <Podcast podcast={podcast} locale={locale} />
      </OneColumn>
    </div>
  );
};

export default injectT(PodcastPage);
