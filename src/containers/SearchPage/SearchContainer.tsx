/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { FormEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
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
  Spinner,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb, usePaginationTranslations } from "@ndla/ui";
import { GrepFilter } from "./GrepFilter";
import { ResourceTypeFilter } from "./ResourceTypeFilter";
import { SearchResult } from "./SearchResult";
import { RESOURCE_NODE_TYPE } from "./searchUtils";
import { SubjectFilter } from "./SubjectFilter";
import { TraitFilter } from "./TraitFilter";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import { LanguageSelectorSelect } from "../../components/LanguageSelector/LanguageSelectorSelect";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import {
  GQLSearchPageQueryVariables,
  GQLSearchContainer_ResourceTypeDefinitionFragment,
  GQLSearchPageQuery,
} from "../../graphqlTypes";
import { preferredLanguages } from "../../i18n";
import { LocaleType } from "../../interfaces";
import { useLtiContext } from "../../LtiContext";

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

const FiltersWrapper = styled("section", {
  base: {
    marginBlockStart: "large",
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    // TODO: This is a weird value
    width: "360px",
    desktopDown: {
      width: "100%",
    },
  },
});

const MobilePaginationButtonContainer = styled("div", {
  base: {
    display: "flex",
    gap: "3xsmall",
    justifyContent: "center",
    tablet: {
      display: "none",
    },
  },
});

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const StyledPaginationRoot = styled(PaginationRoot, {
  base: {
    marginBlockStart: "xsmall",
    tabletDown: {
      display: "none",
    },
  },
});

const FormWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "3xsmall",
  },
});

const searchPageQueryFragment = gql`
  # TODO: Rename this once we delete old search
  query searchPage(
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
    $resultTypes: String
    $nodeTypes: String
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
      resultTypes: $resultTypes
      nodeTypes: $nodeTypes
    ) {
      page
      pageSize
      language
      totalCount
      results {
        ...SearchResult_SearchResult
      }
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
    gap: "medium",
  },
});

const StyledButton = styled(Button, {
  base: {
    tabletWideDown: {
      "& span": {
        display: "none",
      },
    },
  },
});

const getTypeVariables = (
  resourceTypes: string | null,
  allResourceTypes: GQLSearchContainer_ResourceTypeDefinitionFragment[] | undefined,
  nodeType: string,
) => {
  // TODO: Figure out if we want this. It depends on what search approach we go for
  if (nodeType !== RESOURCE_NODE_TYPE) {
    return {
      contextTypes: nodeType === "topic" ? "topic-article" : nodeType === "subject" ? "subject" : nodeType,
      resultTypes: nodeType === "subject" ? "node" : undefined,
      nodeTypes: nodeType === "subject" ? "SUBJECT" : undefined,
    };
  }

  const actualResourceTypes = resourceTypes
    ?.split(",")
    .map((id) => `urn:resourcetype:${id}`)
    .join(",");

  const flattenedResourceTypes = allResourceTypes
    ?.flatMap((rt) => (rt.subtypes?.length ? rt.subtypes.map((st) => st.id) : rt.id))
    .join(",");

  return {
    resourceTypes: actualResourceTypes ?? flattenedResourceTypes,
    contextTypes: "standard,learningpath",
    // TODO: Keep for later, in case we want to replace "resource" with "all"
    // resultTypes: !resourceTypes ? "article,node" : undefined,
    // nodeTypes: !resourceTypes ? "SUBJECT" : undefined,
  };
};

interface Props {
  resourceTypes: GQLSearchContainer_ResourceTypeDefinitionFragment[];
  resourceTypesLoading: boolean;
}

export const SearchContainer = ({ resourceTypes, resourceTypesLoading }: Props) => {
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const [query, setQuery] = useState(searchParams.get("query") ?? "");
  const [page, setPage] = useState(() => {
    const maybePage = parseInt(searchParams.get("page") ?? "1");
    return maybePage ?? 1;
  });
  const focusRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filterHeadingId = useId();
  const isLti = useLtiContext();
  const { t, i18n } = useTranslation();
  const paginationTranslations = usePaginationTranslations();

  const queryParams: GQLSearchPageQueryVariables = useMemo(() => {
    const subjects =
      searchParams
        .get("subjects")
        ?.split(",")
        .map((s) => `urn:subject:${s}`)
        .join(",") ?? undefined;
    return {
      query: searchParams.get("query") ?? undefined,
      language: i18n.language,
      page: parseInt(searchParams.get("page") ?? "1") ?? undefined,
      subjects,
      pageSize: 10,
      aggregatePaths: ["context.resourceTypes.id"],
      traits: searchParams.get("traits") ?? undefined,
      fallback: "true",
      license: "all",
      grepCodes: searchParams.get("grepCodes") ?? undefined,
      filterInactive: !subjects?.split(",").length,
      ...getTypeVariables(
        searchParams.get("resourceTypes"),
        isLti ? resourceTypes : undefined,
        searchParams.get("type") ?? RESOURCE_NODE_TYPE,
      ),
    };
  }, [i18n.language, isLti, resourceTypes, searchParams]);

  const searchQuery = useQuery<GQLSearchPageQuery, GQLSearchPageQueryVariables>(searchPageQueryFragment, {
    variables: queryParams,
  });

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") ?? "1");
    if (pageParam !== page) {
      setPage(pageParam);
    }
  }, [page, searchParams]);

  const data = searchQuery.data ?? searchQuery.previousData;

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setSearchParams({ query });
    },
    [query, setSearchParams],
  );

  const suggestion = data?.search?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

  const resultsTranslation = useMemo(() => {
    if (!data?.search) return undefined;
    const res = [];

    if (data.search.totalCount) {
      const from = Math.max(page * data.search.pageSize - (data.search.pageSize - 1), 0);
      const to = Math.min((page || 1) * data.search.pageSize, data.search.totalCount);
      res.push(t("searchPage.showingResults.hits", { from, to, total: data.search.totalCount }));
    } else {
      res.push(t("searchPage.showingResults.noHits"));
    }
    const currentQuery = searchParams.get("query");
    if (currentQuery?.length) {
      res.push(t("searchPage.showingResults.query"));
      // TODO: Should we account for the possibility that the query is wrapped in quotes? If so, how should we display it?
      // Keep query out of the translation string to avoid escaping issues
      res.push(`"${currentQuery}"`);
    }
    return res.filter(Boolean).join(" ");
  }, [data?.search, page, searchParams, t]);

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
      <ContentWrapper>
        <ResultsWrapper>
          <Heading id={SKIP_TO_CONTENT_ID} srOnly={isLti} ref={focusRef} tabIndex={-1}>
            {t("searchPage.title")}
          </Heading>
          <FormWrapper>
            <form action="/search/" onSubmit={handleSubmit}>
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
            {!!resultsTranslation && (
              <Text textStyle="label.small" aria-live="polite" role="status">
                {resultsTranslation}
              </Text>
            )}
            {!!suggestion && (
              <Text>
                {t("searchPage.querySuggestion")}
                <Button
                  variant="link"
                  onClick={() => {
                    setQuery(suggestion);
                    setSearchParams({ query: suggestion });
                  }}
                >
                  [{suggestion}]
                </Button>
              </Text>
            )}
            {!!searchQuery.loading && <Spinner aria-label={t("loading")} />}
          </FormWrapper>
          <ul>{data?.search?.results.map((result) => <SearchResult searchResult={result} key={result.id} />)}</ul>
          {!!data?.search && data.search.totalCount > data.search.pageSize && (
            <StyledPaginationRoot
              page={page}
              onPageChange={(details) => {
                setPage(details.page);
                setSearchParams({ page: details.page === 1 ? null : details.page.toString() });
              }}
              onClick={() => focusRef.current?.focus()}
              count={Math.min(data.search.totalCount, 10000)}
              pageSize={data?.search?.pageSize ?? 0}
              translations={paginationTranslations}
              siblingCount={1}
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
            </StyledPaginationRoot>
          )}
          <MobilePaginationButtonContainer>
            <Button
              variant="tertiary"
              aria-label={t("pagination.prev")}
              title={t("pagination.prev")}
              disabled={page === 1}
              onClick={() => {
                const prevPage = page - 1;
                setPage(prevPage);
                setSearchParams({ page: prevPage === 1 ? null : prevPage.toString() });
                focusRef.current?.focus();
              }}
            >
              <ArrowLeftShortLine />
              <span>{t("pagination.prev")}</span>
            </Button>
            <Button
              variant="tertiary"
              aria-label={t("pagination.next")}
              title={t("pagination.next")}
              disabled={!data?.search || Math.min(data.search.totalCount, 10000) <= page * data.search.pageSize}
              onClick={() => {
                const nextPage = page + 1;
                setPage(nextPage);
                setSearchParams({ page: nextPage.toString() });
                focusRef.current?.focus();
              }}
            >
              <span>{t("pagination.next")}</span>
              <ArrowRightShortLine />
            </Button>
          </MobilePaginationButtonContainer>
        </ResultsWrapper>
        <FiltersWrapper aria-labelledby={filterHeadingId}>
          <Heading id={filterHeadingId} textStyle="title.medium" asChild consumeCss>
            <h2>{t("searchPage.filtersHeading")}</h2>
          </Heading>
          <ResourceTypeFilter
            bucketResult={data?.search?.aggregations?.[0]?.values ?? []}
            resourceTypes={resourceTypes}
            resourceTypesLoading={resourceTypesLoading}
          />
          <GrepFilter />
          <TraitFilter />
          <SubjectFilter />
          {!!isLti && (
            <LanguageSelectorSelect
              languages={preferredLanguages}
              onValueChange={(details) => i18n.changeLanguage(details.value[0] as LocaleType)}
            />
          )}
        </FiltersWrapper>
      </ContentWrapper>
    </StyledMain>
  );
};

SearchContainer.fragments = {
  resourceTypeDefinition: gql`
    fragment SearchContainer_ResourceTypeDefinition on ResourceTypeDefinition {
      ...ResourceTypeFilter_ResourceTypeDefinition
    }
    ${ResourceTypeFilter.fragments.resourceTypeDefinition}
  `,
};
