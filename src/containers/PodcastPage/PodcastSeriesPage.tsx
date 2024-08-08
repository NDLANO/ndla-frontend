/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { transform } from "@ndla/article-converter";
import { spacing } from "@ndla/core";
import { useComponentSize } from "@ndla/hooks";
import { ArrowDownShortLine } from "@ndla/icons/common";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
} from "@ndla/primitives";
import { HelmetWithTracker } from "@ndla/tracker";
import { ContentTypeBadgeNew, OneColumn } from "@ndla/ui";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import {
  AcquireLicensePage,
  MastheadHeightPx,
  PODCAST_SERIES_LIST_PAGE_PATH,
  SKIP_TO_CONTENT_ID,
} from "../../constants";
import { GQLContributorInfoFragment, GQLCopyrightInfoFragment, GQLPodcastSeriesPageQuery } from "../../graphqlTypes";
import { copyrightInfoFragment } from "../../queries";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { publisher } from "../../util/getStructuredDataFromArticle";
import { hasLicensedContent } from "../ResourceEmbed/components/ResourceEmbed";
import ResourceEmbedLicenseBox from "../ResourceEmbed/components/ResourceEmbedLicenseBox";

interface RouteParams extends TypedParams {
  id: string;
}

const TitleWrapper = styled.hgroup`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
  margin-top: ${spacing.normal};
  margin-block: ${spacing.normal};
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
  const {
    error,
    loading,
    data: { podcastSeries } = {},
  } = useQuery<GQLPodcastSeriesPageQuery>(podcastSeriesPageQuery, {
    variables: { id: Number(id) },
  });
  const { height = MastheadHeightPx } = useComponentSize("masthead");

  const embeds = useMemo(() => {
    if (!podcastSeries?.content?.content) return;
    return transform(podcastSeries.content.content, { renderContext: "embed" });
  }, [podcastSeries?.content?.content]);

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.slice(1));
        const elementTop = element?.getBoundingClientRect().top ?? 0;
        const bodyTop = document.body.getBoundingClientRect().top ?? 0;
        const absoluteTop = elementTop - bodyTop;
        const scrollPosition = absoluteTop - height - 20;

        window.scrollTo({
          top: scrollPosition,
          behavior: "smooth",
        });
      }, 200);
    }
  }, [podcastSeries, location, height]);

  const { t } = useTranslation();

  const getDocumentTitle = (podcast: GQLPodcastSeriesPageQuery["podcastSeries"]) => {
    return `${podcast?.title?.title || t("podcastPage.podcast")} - ${t("htmlTitles.titleTemplate")}`;
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
    arr?.map((item) => ({
      "@type": type,
      name: item.name,
    }));

  const getCopyrightData = (copyright: GQLCopyrightInfoFragment) => {
    const { creators, rightsholders, license, processors } = copyright;
    return {
      license: license?.url,
      author: mapType("Person", creators),
      copyrightHolder: mapType("Organization", rightsholders),
      contributor: mapType("Person", processors),
    };
  };

  const podcastSeriesJSONLd = () => {
    const seriesData = {
      "@context": "https://schema.org",
      "@type": "PodcastSeries",
      url: url,
      name: podcastSeries.title.title,
      abstract: podcastSeries.description.description,
      webFeed: podcastSeries.hasRSS && rssUrl,
      image: podcastSeries.coverPhoto.url,
      acquireLicensePage: AcquireLicensePage,
      ...publisher,
    };
    const episodes = podcastSeries.episodes?.map((episode) => {
      return {
        "@context": "https://schema.org",
        "@type": "PodcastEpisode",
        "@id": `${url}/#${episode?.id}`,
        name: episode?.title.title,
        audio: {
          "@type": "AudioObject",
          contentUrl: episode?.audioFile.url,
        },
        abstract: episode?.podcastMeta?.introduction,
        acquireLicensePage: AcquireLicensePage,
        partOfSeries: {
          "@context": "https://schema.org",
          "@type": "PodcastSeries",
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
          <meta name="description" content={podcastSeries.description.description} />
        )}
        {podcastSeries.hasRSS && (
          <link type="application/rss+xml" rel="alternate" title={podcastSeries.title.title} href={rssUrl} />
        )}
        <script type="application/ld+json">{podcastSeriesJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        type="website"
        title={podcastSeries.title.title ?? ""}
        trackableContent={{
          tags: podcastSeries?.episodes?.flatMap((ep) => ep.tags?.tags || []),
          supportedLanguages: podcastSeries.supportedLanguages,
        }}
        description={podcastSeries.description.description}
        imageUrl={podcastSeries.coverPhoto.url}
      />
      <OneColumn>
        <TitleWrapper>
          <ContentTypeBadgeNew contentType="podcast" />
          <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
            {podcastSeries.title.title}
          </Heading>
        </TitleWrapper>
        <SeriesDescription>
          <StyledImage src={podcastSeries.coverPhoto.url} alt={podcastSeries.coverPhoto.altText} />
          {podcastSeries.description.description}
        </SeriesDescription>
        <EpisodesWrapper>
          {podcastSeries.content ? (
            <>
              <h2>{t("podcastPage.episodes")}</h2>
              {embeds}
              <AccordionRoot multiple>
                {podcastSeries.content.meta && hasLicensedContent(podcastSeries.content.meta) && (
                  <AccordionItem value="rulesForUse">
                    <Heading asChild consumeCss fontWeight="bold" textStyle="label.medium">
                      <h2>
                        <AccordionItemTrigger>
                          {t("article.useContent")}
                          <AccordionItemIndicator asChild>
                            <ArrowDownShortLine size="medium" />
                          </AccordionItemIndicator>
                        </AccordionItemTrigger>
                      </h2>
                    </Heading>
                    <AccordionItemContent>
                      <ResourceEmbedLicenseBox metaData={podcastSeries.content.meta} />
                    </AccordionItemContent>
                  </AccordionItem>
                )}
              </AccordionRoot>
            </>
          ) : (
            <NoResults>{t("podcastPage.noResults")}</NoResults>
          )}
        </EpisodesWrapper>
      </OneColumn>
    </>
  );
};
const podcastSeriesPageQuery = gql`
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
        altText
      }
      content {
        content
        meta {
      ...ResourceEmbedLicenseBox_Meta
        }
      }
      episodes {
        id
        title {
        title
      }
          audioFile {
        url
      }
          podcastMeta {
        introduction
      }
          copyright {

        ...CopyrightInfo
      }
        tags {
          tags
        }
      }
      hasRSS
    }
    ${ResourceEmbedLicenseBox.fragments.metaData}
    ${copyrightInfoFragment}
  }
`;

export default PodcastSeriesPage;
