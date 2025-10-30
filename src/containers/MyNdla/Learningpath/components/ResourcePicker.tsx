/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useState, useMemo, RefObject, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createListCollection } from "@ark-ui/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  Badge,
  ComboboxContentStandalone,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxList,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  ListItemContent,
  ListItemRoot,
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
import { BadgesContainer, useComboboxTranslations, usePaginationTranslations } from "@ndla/ui";
import { ResourceData } from "./folderTypes";
import {
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from "../../../../constants";
import { GQLResourcePickerSearchQuery, GQLResourcePickerSearchQueryVariables } from "../../../../graphqlTypes";
import { contentTypeMapping } from "../../../../util/getContentType";
import { getListItemTraits } from "../../../../util/listItemTraits";
import { useDebounce } from "../../../../util/useDebounce";

const HitsWrapper = styled("div", {
  base: {
    marginBlockStart: "3xsmall",
    textAlign: "start",
  },
});

const StyledListItemContent = styled(ListItemContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "4xsmall",
    flex: "1",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    textAlign: "start",
  },
});

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    overflowY: "unset",
    maxHeight: "surface.medium",
  },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    overflowY: "auto",
  },
});

const StyledPaginationRoot = styled(PaginationRoot, {
  base: {
    marginBlockStart: "medium",
    flexWrap: "wrap",
  },
});

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    flexWrap: "wrap",
  },
});

/**
  Copied from Editorial

 keyboard scrolling does not work properly when items are not nested directly within
 ComboboxContent, so we need to provide a custom scroll function
 TODO: Check if ark provides a better fix for this.
 */
const scrollToIndexFn = (contentRef: RefObject<HTMLDivElement | null>, index: number) => {
  const el = contentRef.current?.querySelectorAll(`[role='option']`)[index];
  el?.scrollIntoView({ behavior: "auto", block: "nearest" });
};

interface Props {
  setResource: (data: ResourceData) => void;
}

const SEARCH_RESOURCE_TYPES = [
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SOURCE_MATERIAL,
].join();

const PAGE_SIZE = 10;

const searchQuery = gql`
  query resourcePickerSearch($query: String, $page: Int, $pageSize: Int!, $resourceTypes: String) {
    search(query: $query, page: $page, pageSize: $pageSize, resourceTypes: $resourceTypes) {
      pageSize
      page
      language
      totalCount
      results {
        id
        url
        title
        ... on ArticleSearchResult {
          htmlTitle
          traits
        }
        ... on LearningpathSearchResult {
          htmlTitle
          traits
        }
        contexts {
          contextId
          isPrimary
          url
          breadcrumbs
          relevanceId
          resourceTypes {
            id
            name
          }
        }
      }
    }
  }
`;

export const ResourcePicker = ({ setResource }: Props) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const delayedQuery = useDebounce(query, 250);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPage(1);
  }, [delayedQuery]);

  const { loading, data: searchResult = {} } = useQuery<
    GQLResourcePickerSearchQuery,
    GQLResourcePickerSearchQueryVariables
  >(searchQuery, {
    variables: {
      query: delayedQuery,
      page: page,
      pageSize: PAGE_SIZE,
      resourceTypes: SEARCH_RESOURCE_TYPES,
    },
    fetchPolicy: "no-cache",
  });

  const paginationTranslations = usePaginationTranslations();
  const comboboxTranslations = useComboboxTranslations();

  const searchHits = useMemo(() => {
    return (
      searchResult.search?.results.map((result) => {
        const context = result.contexts.find((context) => context.isPrimary) ?? result.contexts[0];
        const contentType = contentTypeMapping?.[context?.resourceTypes?.[0]?.id ?? "default"];
        const traits = getListItemTraits(
          {
            relevanceId: context?.relevanceId,
            resourceTypes: context?.resourceTypes,
            contentType,
            traits:
              result.__typename === "ArticleSearchResult" || result.__typename === "LearningpathSearchResult"
                ? result.traits
                : undefined,
          },
          t,
        );
        return {
          ...result,
          id: result.id.toString(),
          resourceType: context?.resourceTypes?.[0]?.id,
          contentType,
          traits,
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [searchResult.search?.results, t]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: searchHits,
        itemToValue: (item) => item.id,
        itemToString: (item) => item.title,
      }),
    [searchHits],
  );

  return (
    <ComboboxRoot
      highlightedValue={highlightedValue}
      onHighlightChange={(details) => setHighlightedValue(details.highlightedValue)}
      collection={collection}
      translations={comboboxTranslations}
      scrollToIndexFn={(details) => scrollToIndexFn(contentRef, details.index)}
      onInputValueChange={(details) => setQuery(details.inputValue)}
      inputValue={query}
      positioning={{ strategy: "fixed" }}
      selectionBehavior="preserve"
      closeOnSelect={false}
      context="standalone"
      variant="complex"
      onValueChange={(details) => {
        if (details.items[0]) {
          const val = details.items[0];
          setResource({
            articleId: parseInt(val.id),
            title: val.title,
            resourceTypes: val.contexts?.[0]?.resourceTypes,
            breadcrumbs: val.contexts?.[0]?.breadcrumbs,
          });
        }
      }}
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput
            asChild
            onKeyDown={(e) => {
              if (e.key === "Enter" && !highlightedValue) {
                e.preventDefault();
              }
            }}
          >
            <Input placeholder={t("searchPage.searchFieldPlaceholderShort")} />
          </ComboboxInput>
        </InputContainer>
      </ComboboxControl>
      <StyledComboboxContent ref={contentRef} tabIndex={-1}>
        <HitsWrapper aria-live="assertive">
          <div>
            {!(searchHits.length >= 1) && !loading ? (
              <Text textStyle="label.small">{t("searchPage.noHitsShort", { query })}</Text>
            ) : (
              <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${query}"`}</Text>
            )}
          </div>
        </HitsWrapper>
        {loading ? (
          <Spinner />
        ) : (
          <StyledComboboxList tabIndex={-1}>
            {collection.items.map((resource) => (
              <StyledComboboxItem key={collection.getItemValue(resource)} item={resource} className="peer" asChild>
                <StyledListItemRoot context="list">
                  <StyledListItemContent>
                    <ComboboxItemText>
                      {resource.__typename === "ArticleSearchResult" ||
                      resource.__typename === "LearningpathSearchResult"
                        ? parse(resource.htmlTitle)
                        : resource.title}
                    </ComboboxItemText>
                    {!!resource.contexts[0] && (
                      <Text
                        textStyle="label.small"
                        color="text.subtle"
                        css={{ textAlign: "start" }}
                        aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.contexts[0]?.breadcrumbs.join(", ")}`}
                      >
                        {resource.contexts[0].breadcrumbs.join(" > ")}
                      </Text>
                    )}
                    <BadgesContainer>
                      {resource.traits.map((trait) => (
                        <Badge key={`${resource.id}-${trait}`}>{trait}</Badge>
                      ))}
                    </BadgesContainer>
                  </StyledListItemContent>
                </StyledListItemRoot>
              </StyledComboboxItem>
            ))}
          </StyledComboboxList>
        )}
        {searchResult.search && searchResult.search.totalCount > searchResult.search.pageSize ? (
          <StyledPaginationRoot
            page={page}
            onPageChange={(details) => {
              setPage(details.page);
            }}
            count={Math.min(searchResult.search?.totalCount ?? 0, 1000)}
            pageSize={PAGE_SIZE}
            translations={paginationTranslations}
            siblingCount={2}
          >
            <PaginationPrevTrigger asChild>
              <IconButton
                variant="tertiary"
                aria-label={t("pagination.prev")}
                title={t("pagination.prev")}
                size="small"
              >
                <ArrowLeftShortLine />
              </IconButton>
            </PaginationPrevTrigger>
            <PaginationContext>
              {(pagination) =>
                pagination.pages.map((page, index) =>
                  page.type === "page" ? (
                    <PaginationItem key={index} {...page} asChild>
                      <IconButton size="small" variant={page.value === pagination.page ? "primary" : "tertiary"}>
                        {page.value}
                      </IconButton>
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
              <IconButton size="small" variant="tertiary" aria-label={t("pagination.ext")} title={t("pagination.next")}>
                <ArrowRightShortLine />
              </IconButton>
            </PaginationNextTrigger>
          </StyledPaginationRoot>
        ) : null}
      </StyledComboboxContent>
    </ComboboxRoot>
  );
};
