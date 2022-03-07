/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { ArticleTitle, OneColumn } from '@ndla/ui';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import { podcastSeriesQuery } from '../../queries';
import Podcast from './Podcast';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { LocaleType } from '.../../../interfaces';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLPodcastSeries,
  GQLPodcastSeriesQueryQuery,
} from '../../graphqlTypes';
import { PODCAST_SERIES_LIST_PAGE_PATH } from '../../constants';
import config from '../../config';

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  locale: LocaleType;
  skipToContentId: string;
}

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${spacing.normal};
`;

const SeriesDescription = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledImage = styled.img`
  max-width: 150px;
  max-height: 150px;
  margin-right: ${spacing.normal};
`;

const EpisodesWrapper = styled.div`
  padding-top: ${spacing.small};
  figure:first-of-type {
    margin-top: 0;
  }
`;

const PodcastSeriesPage = ({
  match: {
    params: { id },
  },
}: Props) => {
  const { error, loading, data: { podcastSeries } = {} } = useQuery<
    GQLPodcastSeriesQueryQuery
  >(podcastSeriesQuery, {
    variables: { id: Number(id) },
  });

  const { t } = useTranslation();

  const getDocumentTitle = (podcast: GQLPodcastSeries) => {
    return `${podcast?.title?.title || t('podcastPage.podcast')} - ${t(
      'htmlTitles.titleTemplate',
    )}`;
  };

  if (loading) {
    return null;
  }

  if (!podcastSeries) {
    return <Redirect to={PODCAST_SERIES_LIST_PAGE_PATH} />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  const imageUrlObj = podcastSeries.coverPhoto?.url
    ? { url: podcastSeries.coverPhoto.url }
    : undefined;

  const rssUrl = `${config?.ndlaFrontendDomain}/podkast/${podcastSeries.id}/feed.xml`;

  return (
    <>
      <HelmetWithTracker title={`${getDocumentTitle(podcastSeries)}`}>
        {podcastSeries.description.description && (
          <meta
            name="description"
            content={podcastSeries.description.description}
          />
        )}
        <link
          type="application/rss+xml"
          rel="alternate"
          title={podcastSeries.title.title}
          href={rssUrl}
        />
      </HelmetWithTracker>
      <SocialMediaMetadata
        title={podcastSeries.title.title ?? ''}
        trackableContent={{
          tags: podcastSeries?.episodes?.flatMap(ep => ep.tags?.tags || []),
          supportedLanguages: podcastSeries.supportedLanguages,
        }}
        description={podcastSeries.description.description}
        image={imageUrlObj}
      />
      <OneColumn>
        <TitleWrapper>
          <ArticleTitle label={t('podcastPage.podcast')}>
            {podcastSeries.title.title}
          </ArticleTitle>
        </TitleWrapper>
        <SeriesDescription>
          <StyledImage src={podcastSeries.coverPhoto.url} />
          {podcastSeries.description.description}
        </SeriesDescription>
        <EpisodesWrapper>
          {podcastSeries.episodes?.length ? (
            <>
              <h2>{t('podcastPage.episodes')}</h2>
              {podcastSeries.episodes?.map(episode => (
                <Podcast podcast={episode} seriesId={id} />
              ))}
            </>
          ) : (
            <div>{t('podcastPage.noEpisodes')}</div>
          )}
        </EpisodesWrapper>
      </OneColumn>
    </>
  );
};

export default withRouter(PodcastSeriesPage);
