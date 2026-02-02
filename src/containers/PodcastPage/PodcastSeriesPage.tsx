/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { transform } from "@ndla/article-converter";
import { ArrowDownShortLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  Badge,
  Heading,
  Hero,
  HeroBackground,
  HeroContent,
  PageContent,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ArticleContent, ArticleFooter, ArticleHeader, ArticleHGroup, ArticleWrapper, HomeBreadcrumb } from "@ndla/ui";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageTitle } from "../../components/PageTitle";
import { RestrictedContent } from "../../components/RestrictedBlock";
import { useRestrictedMode } from "../../components/RestrictedModeContext";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { AcquireLicensePage, PODCAST_SERIES_LIST_PAGE_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPodcastSeriesPageQuery } from "../../graphqlTypes";
import { publisher } from "../../util/getStructuredDataFromArticle";
import { hasLicensedContent } from "../ResourceEmbed/components/ResourceEmbed";
import { ResourceEmbedLicenseContent } from "../ResourceEmbed/components/ResourceEmbedLicenseContent";

const getDocumentTitle = (podcast: NonNullable<GQLPodcastSeriesPageQuery["podcastSeries"]>, t: TFunction) => {
  return `${podcast?.title?.title || t("podcastPage.podcast")} - ${t("htmlTitles.titleTemplate")}`;
};

const StyledHeroContent = styled(HeroContent, {
  base: {
    "& a:focus-within": {
      outlineColor: "currentcolor",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    overflowX: "clip",
  },
});

export const PodcastSeriesPage = () => {
  const { id } = useParams();
  const restrictedInfo = useRestrictedMode();
  const {
    error,
    loading,
    data: { podcastSeries } = {},
  } = useQuery<GQLPodcastSeriesPageQuery>(podcastSeriesPageQuery, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const embeds = useMemo(() => {
    if (!podcastSeries?.content?.content) return;
    return transform(podcastSeries.content.content, { renderContext: "embed" });
  }, [podcastSeries?.content?.content]);

  const { t } = useTranslation();

  if (loading) {
    return <ContentPlaceholder variant="article" />;
  }

  if (!podcastSeries) {
    return <Navigate to={PODCAST_SERIES_LIST_PAGE_PATH} replace />;
  }

  if (error) {
    return <DefaultErrorMessagePage />;
  }

  const url = `${config?.ndlaFrontendDomain}/podkast/${podcastSeries.id}`;
  const rssUrl = `${url}/feed.xml`;

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
        license: episode?.copyright?.license?.url,
        author: episode?.copyright?.creators.map((c) => ({ "@type": "Person", name: c.name })),
        copyrightHolder: episode?.copyright?.rightsholders.map((c) => ({ "@type": "Organization", name: c.name })),
        contributor: episode?.copyright?.processors.map((c) => ({ "@type": "Person", name: c.name })),
      };
    });
    const data = {
      ...seriesData,
      "@graph": episodes ?? [],
    };
    return JSON.stringify(data);
  };

  return (
    <>
      <PageTitle title={getDocumentTitle(podcastSeries, t)} />
      {!!podcastSeries.hasRSS && (
        <link type="application/rss+xml" rel="alternate" title={podcastSeries.title.title} href={rssUrl} />
      )}
      <script type="application/ld+json">{podcastSeriesJSONLd()}</script>
      <SocialMediaMetadata
        type="website"
        title={podcastSeries.title.title ?? ""}
        trackableContent={{
          supportedLanguages: podcastSeries.supportedLanguages,
        }}
        description={podcastSeries.description.description}
        imageUrl={podcastSeries.coverPhoto.url}
      />
      <main>
        <Hero content="primary">
          <HeroBackground />
          <PageContent variant="article" asChild>
            <StyledHeroContent>
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
            </StyledHeroContent>
          </PageContent>
          <StyledPageContent variant="article" gutters="tabletUp">
            <PageContent variant="content" asChild>
              <ArticleWrapper>
                <ArticleHeader>
                  <ArticleHGroup>
                    <Badge>{t("contentTypes.podcast")}</Badge>
                    <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
                      {podcastSeries.title.title}
                    </Heading>
                  </ArticleHGroup>
                  <Text textStyle="body.xlarge">{podcastSeries.description.description}</Text>
                </ArticleHeader>
                <RestrictedContent>
                  {podcastSeries.content ? (
                    <ArticleContent>
                      <section>
                        <h2>{t("podcastPage.episodes")}</h2>
                        {embeds}
                      </section>
                    </ArticleContent>
                  ) : (
                    <Text>{t("podcastPage.noResults")}</Text>
                  )}
                </RestrictedContent>
                {!!podcastSeries?.content?.meta &&
                  hasLicensedContent(podcastSeries.content.meta) &&
                  !restrictedInfo.restricted && (
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
                            <ResourceEmbedLicenseContent metaData={podcastSeries.content.meta} />
                          </AccordionItemContent>
                        </AccordionItem>
                      </AccordionRoot>
                    </ArticleFooter>
                  )}
              </ArticleWrapper>
            </PageContent>
          </StyledPageContent>
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
      ...ResourceEmbedLicenseContent_Meta
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
            license {
              license
              url
              description
            }
            creators {
              name
              type
            }
            processors {
              name
              type
            }
            rightsholders {
              name
              type
            }
            origin
            processed
      }
      }
      hasRSS
    }
    ${ResourceEmbedLicenseContent.fragments.metaData}
  }
`;

export const Component = PodcastSeriesPage;
