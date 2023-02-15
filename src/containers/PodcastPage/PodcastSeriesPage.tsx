/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from 'react';
import { ArticleTitle, getMastheadHeight, OneColumn } from '@ndla/ui';
import { Navigate, useLocation } from 'react-router-dom';
import { HelmetWithTracker } from '@ndla/tracker';
import { useTranslation } from 'react-i18next';
import { gql, useQuery } from '@apollo/client';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';
import Audio from './Audio';
import SocialMediaMetadata from '../../components/SocialMediaMetadata';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  AcquireLicensePage,
  MastheadHeightPx,
  PODCAST_SERIES_LIST_PAGE_PATH,
} from '../../constants';
import config from '../../config';
import { publisher } from '../../util/getStructuredDataFromArticle';
import {
  GQLContributorInfoFragment,
  GQLCopyrightInfoFragment,
  GQLPodcastSeriesPageQuery,
} from '../../graphqlTypes';
import { TypedParams, useTypedParams } from '../../routeHelpers';

interface RouteParams extends TypedParams {
  id: string;
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

const PodcastSeriesPage = () => {
  const { id } = useTypedParams<RouteParams>();
  const { error, loading, data: { podcastSeries } = {} } = useQuery<
    GQLPodcastSeriesPageQuery
  >(podcastSeriesPageQuery, {
    variables: { id: Number(id) },
  });

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition =
          absoluteTop - (getMastheadHeight() || MastheadHeightPx) - 20;

        window.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
      }, 200);
    }
  }, [podcastSeries, location]);

  const { t } = useTranslation();

  const getDocumentTitle = (
    podcast: GQLPodcastSeriesPageQuery['podcastSeries'],
  ) => {
    return `${podcast?.title?.title || t('podcastPage.podcast')} - ${t(
      'htmlTitles.titleTemplate',
    )}`;
  };

  if (loading) {
    return null;
  }

  if (!podcastSeries) {
    return <Navigate to={PODCAST_SERIES_LIST_PAGE_PATH} replace />;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  const url = `${config?.ndlaFrontendDomain}/podkast/${podcastSeries.id}`;
  const rssUrl = `${url}/feed.xml`;

  const mapType = (type: string, arr?: GQLContributorInfoFragment[]) =>
    arr?.map(item => ({
      '@type': type,
      name: item.name,
    }));

  const getCopyrightData = (copyright: GQLCopyrightInfoFragment) => {
    const { creators, rightsholders, license, processors } = copyright;
    return {
      license: license?.url,
      author: mapType('Person', creators),
      copyrightHolder: mapType('Organization', rightsholders),
      contributor: mapType('Person', processors),
    };
  };

  const podcastSeriesJSONLd = () => {
    const seriesData = {
      '@context': 'https://schema.org',
      '@type': 'PodcastSeries',
      url: url,
      name: podcastSeries.title.title,
      abstract: podcastSeries.description.description,
      webFeed: rssUrl,
      image: podcastSeries.coverPhoto.url,
      acquireLicensePage: AcquireLicensePage,
      ...publisher,
    };
    const episodes = podcastSeries.episodes?.map(episode => {
      return {
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        '@id': `${url}/#${episode?.id}`,
        name: episode?.title.title,
        audio: {
          '@type': 'AudioObject',
          contentUrl: episode?.audioFile.url,
        },
        abstract: episode?.podcastMeta?.introduction,
        acquireLicensePage: AcquireLicensePage,
        partOfSeries: {
          '@context': 'https://schema.org',
          '@type': 'PodcastSeries',
          url: url,
        },
        ...publisher,
        ...getCopyrightData(episode.copyright),
      };
    });
    const data = [seriesData, ...(episodes || [])];
    return JSON.stringify(data);
  };

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
        <script type="application/ld+json">{podcastSeriesJSONLd()}</script>
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
              {podcastSeries.episodes.map(episode => (
                <Audio key={episode.id} audio={episode} seriesId={id} />
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
const podcastSeriesPageQuery = gql`
  ${Audio.fragments.audio}
  query podcastSeriesPage($id: Int!) {
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
        ...Podcast_Audio
        tags {
          tags
        }
      }
    }
  }
`;

export default PodcastSeriesPage;
