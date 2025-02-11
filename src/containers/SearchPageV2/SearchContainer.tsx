/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql, useQuery } from "@apollo/client";
import { ArrowLeftShortLine, ArrowRightShortLine, CloseLine, SearchLine } from "@ndla/icons";
import {
  Button,
  FieldInput,
  FieldLabel,
  FieldRoot,
  Heading,
  IconButton,
  InputContainer,
  PaginationContext,
  PaginationEllipsis,
  PaginationItem,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb, usePaginationTranslations } from "@ndla/ui";
import { ResourceTypeFilter } from "./ResourceTypeFilter";
import { SearchResult } from "./SearchResult";
import { SubjectFilter } from "./SubjectFilter";
import { TraitFilter } from "./TraitFilter";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLSearchQuery, GQLSearchQueryVariables } from "../../graphqlTypes";
import { useLtiContext } from "../../LtiContext";
import { useStableSearchParams } from "../../util/useStableSearchParams";

const StyledMain = styled("main", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
  },
});

const SearchFieldWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    alignItems: "center",
    width: "100%",
  },
});

const FiltersWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    width: "surface.xsmall",
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const searchQueryFragment = gql`
  # TODO: Rename this once we delete old search
  query newSearchQuery(
    $query: String
    $page: Int
    $pageSize: Int
    $contextTypes: String
    $language: String
    $ids: [Int!]
    $resourceTypes: String
    $levels: String
    $sort: String
    $fallback: String
    $subjects: String
    $languageFilter: String
    $relevance: String
    $grepCodes: String
    $traits: [String!]
    $aggregatePaths: [String!]
    $filterInactive: Boolean
    $license: String
  ) {
    search(
      query: $query
      page: $page
      pageSize: $pageSize
      contextTypes: $contextTypes
      language: $language
      ids: $ids
      resourceTypes: $resourceTypes
      levels: $levels
      sort: $sort
      fallback: $fallback
      subjects: $subjects
      languageFilter: $languageFilter
      relevance: $relevance
      grepCodes: $grepCodes
      traits: $traits
      aggregatePaths: $aggregatePaths
      filterInactive: $filterInactive
      license: $license
    ) {
      page
      pageSize
      language
      totalCount
      results {
        ...SearchResult_SearchResult
      }

      # TODO: Might not need these
      aggregations {
        values {
          ...ResourceTypeFilter_BucketResult
        }
      }
      suggestions {
        suggestions {
          options {
            text
          }
        }
      }
    }
  }
  ${SearchResult.fragments.searchResult}
  ${ResourceTypeFilter.fragments.bucketResult}
`;

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    width: "100%",
    flexDirection: "column",
    desktop: {
      flexDirection: "row",
    },
  },
});

const ResultsWrapper = styled("div", {
  base: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "xlarge",
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

export const SearchContainer = () => {
  const [searchParams, setSearchParams] = useStableSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [page, setPage] = useState(() => {
    const maybePage = parseInt(searchParams.get("page") ?? "0");
    return maybePage ?? 1;
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const isLti = useLtiContext();
  const { t, i18n } = useTranslation();
  const paginationTranslations = usePaginationTranslations();

  const searchQuery = useQuery<GQLSearchQuery, GQLSearchQueryVariables>(searchQueryFragment, {
    variables: {
      query: searchParams.get("query") ?? undefined,
      language: i18n.language,
      page: parseInt(searchParams.get("page") ?? "1") ?? undefined,
      subjects: searchParams.get("subjects") ?? undefined,
      pageSize: 8,
      aggregatePaths: ["contexts.resourceTypes.id"],
      traits: searchParams.get("traits") ?? undefined,
    },
  });

  const data = searchQuery.data ?? searchQuery.previousData;

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearchParams({ query });
    },
    [query, setSearchParams],
  );

  return (
    <StyledMain>
      {!isLti && (
        <HomeBreadcrumb
          items={[
            { name: t("breadcrumb.toFrontpage"), to: "/" },
            { to: "/search", name: t("searchPage.search") },
          ]}
        />
      )}
      {!isLti && (
        <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
          {t("searchPage.title")}
        </Heading>
      )}
      {/* TODO: Change to /search/ */}
      <form action="/searchv2/" onSubmit={handleSubmit}>
        <SearchFieldWrapper>
          <StyledFieldRoot>
            <FieldLabel srOnly>{t("searchPage.title")}</FieldLabel>
            <InputContainer>
              <FieldInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                ref={inputRef}
                placeholder={t("searchPage.searchFieldPlaceholder")}
                type="search"
                autoComplete="off"
                name="search"
              />
              {!!query && (
                <IconButton
                  variant="clear"
                  aria-label={t("welcomePage.resetSearch")}
                  title={t("welcomePage.resetSearch")}
                  onClick={() => {
                    setQuery("");
                    setSearchParams({ query: null });
                    inputRef.current?.focus();
                  }}
                >
                  <CloseLine />
                </IconButton>
              )}
            </InputContainer>
          </StyledFieldRoot>
          <IconButton type="submit" aria-label={t("searchPage.search")} title={t("searchPage.search")}>
            <SearchLine />
          </IconButton>
        </SearchFieldWrapper>
      </form>
      <ContentWrapper>
        <ResultsWrapper>
          {/* TODO: Insane code and i18n */}
          {!!data?.search && !!searchParams.get("query") && (
            <Text>{`Viser treff ${page * data.search.pageSize - (data.search.pageSize - 1)}-${page * data.search.pageSize} for "${searchParams.get("query")}"`}</Text>
          )}
          <ul>{data?.search?.results.map((result) => <SearchResult searchResult={result} key={result.id} />)}</ul>
          <PaginationRoot
            page={page}
            onPageChange={(details) => {
              setPage(details.page);
              setSearchParams({ page: details.page.toString() });
            }}
            count={data?.search?.totalCount ?? 0}
            pageSize={data?.search?.pageSize ?? 0}
            translations={paginationTranslations}
            siblingCount={1}
            // TODO: i18n
            aria-label={t("searchPage.pagination")}
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
        </ResultsWrapper>
        <FiltersWrapper>
          <Heading textStyle="title.medium" asChild consumeCss>
            {/* TODO: i18n */}
            <h2>Tilpass søket ditt</h2>
          </Heading>
          <TraitFilter />
          <SubjectFilter />
          <ResourceTypeFilter bucketResult={data?.search?.aggregations?.[0]?.values ?? []} />
        </FiltersWrapper>
      </ContentWrapper>
    </StyledMain>
  );
};
