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
import { Audio } from '@ndla/icons/lib/common';
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

interface RouteParams {
  id: string;
}

interface Props extends RouteComponentProps<RouteParams> {
  locale: LocaleType;
  skipToContentId: string;
}

const TitleWrapper = styled.div`
  margin-top: ${spacing.normal};
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

  return (
    <>
      <HelmetWithTracker title={`${getDocumentTitle(podcastSeries)}`}>
        {podcastSeries.description.description && (
          <meta
            name="description"
            content={podcastSeries.description.description}
          />
        )}
      </HelmetWithTracker>
      <SocialMediaMetadata
        title={podcastSeries.title.title ?? ''}
        trackableContent={{
          tags: podcastSeries?.episodes?.flatMap(ep => ep.tags?.tags || []),
          supportedLanguages: podcastSeries.supportedLanguages,
        }}
        description={podcastSeries.description.description}
        image={{
          url: podcastSeries.coverPhoto.url,
          alt: podcastSeries.coverPhoto.altText,
        }}
      />
      <OneColumn>
        <TitleWrapper>
          <ArticleTitle icon={Audio} label={t('podcastPage.podcast')}>
            {podcastSeries.title.title}
          </ArticleTitle>
        </TitleWrapper>
        {podcastSeries.episodes?.map(episode => (
          <Podcast podcast={episode} />
        ))}
      </OneColumn>
    </>
  );
};

export default withRouter(PodcastSeriesPage);
