/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  Button,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Text,
  Heading,
  PaginationContext,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { HomeBreadcrumb, usePaginationTranslations } from "@ndla/ui";
import { PodcastSeries } from "./PodcastSeries";
import { DefaultErrorMessagePage } from "../../components/DefaultErrorMessage";
import { PageContainer } from "../../components/Layout/PageContainer";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLPodcastSeriesListPageQuery } from "../../graphqlTypes";
import { useStableSearchParams } from "../../util/useStableSearchParams";

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xxlarge",
  },
});

const StyledHeader = styled("header", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const StyledButton = styled(Button, {
  base: {
    tabletDown: {
      "& span": {
        display: "none",
      },
    },
  },
});

const StyledUl = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

const PAGE_SIZE = 5;

export const PodcastSeriesListPage = () => {
  const { t } = useTranslation();
  const componentTranslations = usePaginationTranslations();
  const [queryParams, setQueryParams] = useStableSearchParams();

  const page = parseInt(queryParams.get("page") ?? "") || 1;

  const apolloClient = useApolloClient();

  const { error, loading, data } = useQuery<GQLPodcastSeriesListPageQuery>(podcastSeriesListPageQuery, {
    variables: {
      page: page,
      pageSize: PAGE_SIZE,
      fallback: true,
    },
  });

  const results = data?.podcastSeriesSearch?.results;

  useEffect(() => {
    const nextPage = page + 1;
    if (nextPage <= PAGE_SIZE) {
      apolloClient.query({
        query: podcastSeriesListPageQuery,
        variables: {
          page: nextPage,
          pageSize: PAGE_SIZE,
          fallback: true,
        },
      });
    }
  }, [page, apolloClient]);

  const onPageChange = (page: number) => {
    setQueryParams({ page: page.toString() });
  };

  if (!data && !loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessagePage />;
  }

  return (
    <StyledPageContainer asChild consumeCss>
      <main>
        <HelmetWithTracker title={t("htmlTitles.podcast", { page: page })} />
        <SocialMediaMetadata type="website" title={t("podcastPage.podcasts")} description={t("podcastPage.meta")} />
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
          ]}
        />
        <StyledHeader>
          <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
            {t("podcastPage.podcasts")}
          </Heading>
          {!!results?.length && (
            <Heading asChild consumeCss textStyle="title.medium">
              <h2>{t("podcastPage.subtitle")}</h2>
            </Heading>
          )}
        </StyledHeader>
        <section>
          {loading ? (
            <Spinner aria-label={t("loading")} />
          ) : results?.length ? (
            <StyledUl>
              {results.map((series) => {
                return <PodcastSeries key={`podcast-${series.id}`} {...series} />;
              })}
            </StyledUl>
          ) : (
            <Text>{t("podcastPage.noResults")}</Text>
          )}
        </section>
        <PaginationRoot
          page={page}
          onPageChange={(details) => onPageChange(details.page)}
          count={data?.podcastSeriesSearch?.totalCount ?? 0}
          pageSize={PAGE_SIZE}
          translations={componentTranslations}
          siblingCount={2}
          aria-label={t("podcastPage.paginationNav")}
        >
          <PaginationPrevTrigger asChild>
            <StyledButton variant="tertiary" aria-label={t("pagination.prev")} title={t("pagination.prev")}>
              <ArrowLeftShortLine />
              <span>{t("pagination.prev")}</span>
            </StyledButton>
          </PaginationPrevTrigger>
          <PaginationContext>
            {(pagination) =>
              pagination.pages.map((page, index) =>
                page.type === "page" ? (
                  <PaginationItem key={index} {...page} asChild>
                    <Button variant={page.value === pagination.page ? "primary" : "tertiary"}>{page.value}</Button>
                  </PaginationItem>
                ) : (
                  <PaginationEllipsis key={index} index={index} asChild>
                    <Text asChild consumeCss>
                      <div>&#8230;</div>
                    </Text>
                  </PaginationEllipsis>
                ),
              )
            }
          </PaginationContext>
          <PaginationNextTrigger asChild>
            <StyledButton variant="tertiary" aria-label={t("pagination.next")} title={t("pagination.next")}>
              <span>{t("pagination.next")}</span>
              <ArrowRightShortLine />
            </StyledButton>
          </PaginationNextTrigger>
        </PaginationRoot>
      </main>
    </StyledPageContainer>
  );
};

const podcastSeriesListPageQuery = gql`
  ${PodcastSeries.fragments.series}
  query podcastSeriesListPage($page: Int!, $pageSize: Int!, $fallback: Boolean) {
    podcastSeriesSearch(page: $page, pageSize: $pageSize, fallback: $fallback) {
      results {
        ...PodcastSeries_PodcastSeriesSummary
      }
      totalCount
    }
  }
`;

export const Component = PodcastSeriesListPage;
