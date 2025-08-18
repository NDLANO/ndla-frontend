/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { t } from "i18next";
import { debounce } from "lodash-es";
import { useState, useMemo, RefObject, useRef } from "react";
import { useQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
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
import { ContentTypeBadge, useComboboxTranslations, usePaginationTranslations } from "@ndla/ui";
import { ResourceData } from "./folderTypes";
import {
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from "../../../../constants";
import { GQLSearchQuery, GQLSearchQueryVariables, GQLSearchResourceFragment } from "../../../../graphqlTypes";
import { searchQuery } from "../../../../queries";
import { contentTypeMapping } from "../../../../util/getContentType";

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

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

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

const DEFAULT_SEARCH_OBJECT = { page: 1, pageSize: 10, query: "" };

export const ResourcePicker = ({ setResource }: Props) => {
  const [searchObject, setSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const [highlightedValue, setHighlightedValue] = useState<string | null>(null);
  const [delayedSearchObject, setDelayedSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const contentRef = useRef<HTMLDivElement>(null);

  const { loading, data: searchResult = {} } = useQuery<GQLSearchQuery, GQLSearchQueryVariables>(searchQuery, {
    variables: {
      query: delayedSearchObject.query,
      page: delayedSearchObject.page,
      pageSize: delayedSearchObject.pageSize,
      resourceTypes: [
        RESOURCE_TYPE_SUBJECT_MATERIAL,
        RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
        RESOURCE_TYPE_ASSESSMENT_RESOURCES,
        RESOURCE_TYPE_CONCEPT,
        RESOURCE_TYPE_SOURCE_MATERIAL,
      ].join(),
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
        return {
          ...result,
          id: result.id.toString(),
          resourceType: context?.resourceTypes?.[0]?.id,
          contentType,
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [searchResult.search?.results]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: searchHits,
        itemToValue: (item) => item.id,
        itemToString: (item) => item.title,
      }),
    [searchHits],
  );

  const onQueryChange = (val: string) => {
    setSearchObject({ query: val, page: 1, pageSize: 10 });
    debounceCall(() => setDelayedSearchObject({ query: val, page: 1, pageSize: 10 }));
  };

  const onResourceSelect = async (resource: Omit<GQLSearchResourceFragment, "__typename">) => {
    setResource({
      articleId: parseInt(resource.id),
      title: resource.title,
      resourceTypes: resource.contexts?.[0]?.resourceTypes,
      breadcrumbs: resource.contexts?.[0]?.breadcrumbs,
    });
  };

  return (
    <ComboboxRoot
      highlightedValue={highlightedValue}
      onHighlightChange={(details) => setHighlightedValue(details.highlightedValue)}
      collection={collection}
      translations={comboboxTranslations}
      scrollToIndexFn={(details) => scrollToIndexFn(contentRef, details.index)}
      onInputValueChange={(details) => onQueryChange(details.inputValue)}
      inputValue={searchObject.query}
      positioning={{ strategy: "fixed" }}
      selectionBehavior="preserve"
      closeOnSelect={false}
      context="standalone"
      variant="complex"
      onValueChange={(details) => {
        if (details.items[0]) {
          onResourceSelect(details.items[0]);
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
              <Text textStyle="label.small">{t("searchPage.noHitsShort", { query: searchObject.query })}</Text>
            ) : (
              <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${searchObject.query}"`}</Text>
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
                  </StyledListItemContent>
                  <ContentTypeBadge contentType={resource.contentType} />
                </StyledListItemRoot>
              </StyledComboboxItem>
            ))}
          </StyledComboboxList>
        )}
        {searchResult.search && searchResult.search.totalCount > searchResult.search.pageSize ? (
          <StyledPaginationRoot
            page={searchObject.page}
            onPageChange={(details) => {
              setSearchObject((prev) => ({ ...prev, page: details.page }));
              setDelayedSearchObject((prev) => ({ ...prev, page: details.page }));
            }}
            count={Math.min(searchResult.search?.totalCount ?? 0, 1000)}
            pageSize={searchObject.pageSize}
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
