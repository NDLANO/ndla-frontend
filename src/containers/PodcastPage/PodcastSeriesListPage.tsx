/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parse, stringify } from "query-string";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import { gql, useApolloClient } from "@apollo/client";
import { PaginationContext } from "@ark-ui/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons/common";
import {
  Button,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker } from "@ndla/tracker";
import { Heading } from "@ndla/typography";
import { OneColumn, usePaginationTranslations } from "@ndla/ui";
import PodcastSeries from "./PodcastSeries";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import { PageSpinner } from "../../components/PageSpinner";
import { GQLPodcastSeriesListPageQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

type SearchObject = {
  page: string;
  "page-size": string;
};

export const getPageSize = (searchObject: SearchObject) => {
  return Number(searchObject["page-size"]) || 5;
};
export const getPage = (searchObject: SearchObject) => {
  return Number(searchObject.page) || 1;
};

const StyledPageNumber = styled("span", { base: { marginBlock: "small" } });

const NoResult = styled("div", { base: { marginBlock: "medium" } });

const StyledPaginationRoot = styled(PaginationRoot, { base: { display: "flex", justifyContent: "center" } });

const PodcastSeriesListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const componentTranslations = usePaginationTranslations();
  const searchObject = parse(location.search);

  const page = getPage(searchObject);
  const pageSize = getPageSize(searchObject);

  const apolloClient = useApolloClient();

  const { error, loading, data, previousData } = useGraphQuery<GQLPodcastSeriesListPageQuery>(
    podcastSeriesListPageQuery,
    {
      variables: {
        page: page,
        pageSize: pageSize,
        fallback: true,
      },
    },
  );

  const results = data?.podcastSeriesSearch?.results;

  const lastPage = Math.ceil(
    (data?.podcastSeriesSearch?.totalCount ?? previousData?.podcastSeriesSearch?.totalCount ?? 0) / pageSize,
  );

  useEffect(() => {
    const nextPage = page + 1;
    if (nextPage <= pageSize) {
      apolloClient.query({
        query: podcastSeriesListPageQuery,
        variables: {
          page: nextPage,
          pageSize: pageSize,
          fallback: true,
        },
      });
    }
  }, [page, pageSize, apolloClient]);

  const onQueryPush = (newSearchObject: object) => {
    const oldSearchObject = parse(location.search);

    const searchQuery = {
      ...oldSearchObject,
      ...newSearchObject,
    };

    // Remove unused/empty query params
    Object.keys(searchQuery).forEach((key) => searchQuery[key] === "" && delete searchQuery[key]);
    navigate(`/podkast?${stringify(searchQuery)}`);
  };

  if (!data && !loading) {
    return null;
  }

  if (error) {
    return <DefaultErrorMessage />;
  }

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <>
      <HelmetWithTracker title={t("htmlTitles.podcast", { page: page })} />
      <OneColumn>
        <Heading element="h1" headingStyle="h1-resource" margin="xlarge">
          {t("podcastPage.podcasts")}
        </Heading>
        {results?.length && results.length > 0 ? (
          <>
            <Heading element="h2" headingStyle="h2">
              {t("podcastPage.subtitle")}
            </Heading>
            {results.map((series) => {
              return <PodcastSeries key={`podcast-${series.id}`} {...series} />;
            })}
            <StyledPageNumber>{t("podcastPage.pageInfo", { page, lastPage })}</StyledPageNumber>
          </>
        ) : (
          <NoResult>{t("podcastPage.noResults")}</NoResult>
        )}
        <StyledPaginationRoot
          page={page}
          onPageChange={(details) => onQueryPush({ ...searchObject, page: details.page })}
          count={data?.podcastSeriesSearch?.totalCount ?? 0}
          pageSize={pageSize}
          translations={componentTranslations}
          siblingCount={2}
        >
          <PaginationPrevTrigger asChild>
            <Button variant="tertiary">
              <ArrowLeftShortLine />
              {t("pagination.prev")}
            </Button>
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
            <Button variant="tertiary">
              {t("pagination.next")}
              <ArrowRightShortLine />
            </Button>
          </PaginationNextTrigger>
        </StyledPaginationRoot>
      </OneColumn>
    </>
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

export default PodcastSeriesListPage;
