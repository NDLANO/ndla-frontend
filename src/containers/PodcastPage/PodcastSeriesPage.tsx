/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { ArticleTitle, OneColumn } from '@ndla/ui';
import { compact } from 'lodash';
import { Redirect, withRouter } from 'react-router-dom';
import { RouteComponentProps, useLocation } from 'react-router';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Podcast from './Podcast';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import { LocaleType } from '.../../../interfaces';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { PODCAST_SERIES_LIST_PAGE_PATH } from '../../constants';
import config from '../../config';
import { GQLPodcastSeriesQueryQuery } from '../../graphqlTypes';

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

const NoResults = styled.div`
  padding-top: ${spacing.medium};
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

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const scrollPosition = elementTop - bodyTop;

        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [podcastSeries, location]);

  const { t } = useTranslation();

  const getDocumentTitle = (
    podcast: GQLPodcastSeriesQueryQuery['podcastSeries'],
  ) => {
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
        imageUrl={podcastSeries.coverPhoto.url}
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
              {compact(podcastSeries.episodes).map(episode => (
                <Podcast podcast={episode} seriesId={id} />
              ))}
            </>
          ) : (
            <NoResults>{t('podcastPage.noResults')}</NoResults>
          )}
        </EpisodesWrapper>
      </OneColumn>
    </>
  );
};
const podcastSeriesQuery = gql`
  ${Podcast.fragments.podcast}
  query podcastSeriesQuery($id: Int!) {
    podcastSeries(id: $id) {
      id
      title {
        title
      }
      description {
        description
      }
      supportedLanguages
      coverPhoto {
        url
      }
      episodes {
        ...PodcastAudio
        tags {
          tags
        }
      }
    }
  }
`;

export default withRouter(PodcastSeriesPage);
