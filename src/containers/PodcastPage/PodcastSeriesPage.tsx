/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { transform } from "@ndla/article-converter";
import { ArrowDownShortLine } from "@ndla/icons/common";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Heading,
  Hero,
  HeroBackground,
  HeroContent,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import {
  ArticleContent,
  ArticleFooter,
  ArticleHeader,
  ArticleWrapper,
  ContentPlaceholder,
  ContentTypeBadgeNew,
  HomeBreadcrumb,
  OneColumn,
} from "@ndla/ui";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { AcquireLicensePage, PODCAST_SERIES_LIST_PAGE_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLContributorInfoFragment, GQLCopyrightInfoFragment, GQLPodcastSeriesPageQuery } from "../../graphqlTypes";
import { copyrightInfoFragment } from "../../queries";
import { TypedParams, useTypedParams } from "../../routeHelpers";
import { publisher } from "../../util/getStructuredDataFromArticle";
import { hasLicensedContent } from "../ResourceEmbed/components/ResourceEmbed";
import ResourceEmbedLicenseBox from "../ResourceEmbed/components/ResourceEmbedLicenseBox";

interface RouteParams extends TypedParams {
  id: string;
}

// TODO: Should we export styling from ndla-ui? (ArticleTitleWrapper)
const TitleWrapper = styled("hgroup", {
  base: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "xsmall",
    "& h1": {
      overflowWrap: "anywhere",
    },
  },
});

const StyledPodcastSeriesWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const PodcastSeriesPage = () => {
  const { id } = useTypedParams<RouteParams>();
  const {
    error,
    loading,
    data: { podcastSeries } = {},
  } = useQuery<GQLPodcastSeriesPageQuery>(podcastSeriesPageQuery, {
    variables: { id: Number(id) },
  });

  const embeds = useMemo(() => {
    if (!podcastSeries?.content?.content) return;
    return transform(podcastSeries.content.content, { renderContext: "embed" });
  }, [podcastSeries?.content?.content]);

  const { t } = useTranslation();

  const getDocumentTitle = (podcast: GQLPodcastSeriesPageQuery["podcastSeries"]) => {
    return `${podcast?.title?.title || t("podcastPage.podcast")} - ${t("htmlTitles.titleTemplate")}`;
  };

  if (loading) {
    return <ContentPlaceholder />;
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
      <main>
        <Hero content="primary">
          <HeroBackground />
          <OneColumn>
            <HeroContent>
              <HomeBreadcrumb
                items={[
                  {
                    name: t("breadcrumb.toFrontpage"),
                    to: "/",
                  },
                  {
                    name: t("podcastPage.podcasts"),
                    to: "/podkast",
                  },
                  {
                    name: podcastSeries.title.title,
                    to: `/podkast/${podcastSeries.id}`,
                  },
                ]}
              />
            </HeroContent>
            <ArticleWrapper>
              <ArticleHeader>
                <TitleWrapper>
                  <ContentTypeBadgeNew contentType={"podcast"} />
                  <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
                    {podcastSeries.title.title}
                  </Heading>
                </TitleWrapper>
                <Text textStyle="body.xlarge">{podcastSeries.description.description}</Text>
              </ArticleHeader>
              <ArticleContent>
                {podcastSeries.content ? (
                  <StyledPodcastSeriesWrapper>
                    <Heading asChild consumeCss textStyle="title.medium">
                      <h2>{t("podcastPage.episodes")}</h2>
                    </Heading>
                    {embeds}
                  </StyledPodcastSeriesWrapper>
                ) : (
                  <Text>{t("podcastPage.noResults")}</Text>
                )}
              </ArticleContent>
              {podcastSeries?.content?.meta && hasLicensedContent(podcastSeries.content.meta) && (
                <ArticleFooter>
                  <AccordionRoot multiple>
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
                  </AccordionRoot>
                </ArticleFooter>
              )}
            </ArticleWrapper>
          </OneColumn>
        </Hero>
      </main>
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
