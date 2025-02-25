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
import { useState, useMemo, useEffect, RefObject, useRef } from "react";
import { useLazyQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { ArrowLeftShortLine, ArrowRightShortLine } from "@ndla/icons";
import {
  Button,
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
import config from "../../../../config";
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
} from "../../../../constants";
import { GQLSearchQuery, GQLSearchQueryVariables, GQLSearchResult } from "../../../../graphqlTypes";
import { searchQuery } from "../../../../queries";
import { contentTypeMapping } from "../../../../util/getContentType";
import { useFetchOembed } from "../learningpathQueries";
import { ResourceData } from "./ResourceStepForm";

const HitsWrapper = styled("div", {
  base: {
    marginBlockStart: "3xsmall",
    textAlign: "start",
  },
});
const SuggestionButton = styled(Button, {
  base: {
    marginInlineStart: "3xsmall",
  },
});

const TextWrapper = styled("div", {
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
  },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    overflowY: "auto",
    height: "surface.medium",
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

type Resource = GQLSearchResult & {
  id: string;
  resourceType?: string;
  contentType?: string;
  path: string;
};

const DEFAULT_SEARCH_OBJECT = { page: 1, pageSize: 10, query: "" };

export const ResourcePicker = ({ setResource }: Props) => {
  const [searchObject, setSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const [delayedSearchObject, setDelayedSearchObject] = useState(DEFAULT_SEARCH_OBJECT);
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<GQLSearchQuery, GQLSearchQueryVariables>(
    searchQuery,
    {
      fetchPolicy: "no-cache",
    },
  );

  const { refetch } = useFetchOembed({ skip: true });

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

  const onSearch = () => {
    runSearch({
      variables: searchObject,
    });
  };

  const onQueryChange = (val: string) => {
    setSearchObject({ query: val, page: 1, pageSize: 10 });
    debounceCall(() => setDelayedSearchObject({ query: val, page: 1, pageSize: 10 }));
  };

  const suggestion = searchResult?.search?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

  const onResourceSelect = async (resource: Resource) => {
    const data = await refetch({ url: `${config.ndlaFrontendDomain}${resource.path}` });
    const iframe = data.data?.learningpathStepOembed.html;
    const url = new DOMParser().parseFromString(iframe, "text/html").getElementsByTagName("iframe")[0]?.src ?? "";

    setResource({
      title: resource.title,
      url: url,
      resourceTypes: resource.contexts?.[0]?.resourceTypes,
      breadcrumbs: resource.contexts?.[0]?.breadcrumbs,
    });
  };

  useEffect(() => {
    runSearch({
      variables: {
        query: delayedSearchObject.query,
        page: delayedSearchObject.page,
        pageSize: delayedSearchObject.pageSize,
        resourceTypes: [
          RESOURCE_TYPE_LEARNING_PATH,
          RESOURCE_TYPE_SUBJECT_MATERIAL,
          RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
        ].join(),
      },
    });
  }, [delayedSearchObject]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ComboboxRoot
      collection={collection}
      translations={comboboxTranslations}
      highlightedValue={highlightedValue}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      scrollToIndexFn={(details) => scrollToIndexFn(contentRef, details.index)}
      onInputValueChange={(details) => onQueryChange(details.inputValue)}
      inputValue={searchObject.query}
      selectionBehavior="preserve"
      closeOnSelect={false}
      context="standalone"
      variant="complex"
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput asChild>
            <Input
              id="resource-input"
              placeholder={t("searchPage.searchFieldPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!highlightedValue) {
                    onSearch();
                    e.preventDefault();
                  }
                  if (highlightedValue) {
                    const resource = searchHits.find((item) => item.id === highlightedValue) as Resource;
                    onResourceSelect(resource);
                  }
                }
              }}
            />
          </ComboboxInput>
        </InputContainer>
      </ComboboxControl>
      <StyledComboboxContent ref={contentRef}>
        <HitsWrapper aria-live="assertive">
          <div>
            {!(searchHits.length >= 1) && !loading ? (
              <Text textStyle="label.small">{t("searchPage.noHitsShort", { query: searchObject.query })}</Text>
            ) : (
              <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${searchObject.query}"`}</Text>
            )}
            {!!suggestion && (
              <Text textStyle="label.small">
                {t("searchPage.resultType.searchPhraseSuggestion")}
                <SuggestionButton variant="link" onClick={() => onQueryChange(suggestion)}>
                  [{suggestion}]
                </SuggestionButton>
              </Text>
            )}
          </div>
        </HitsWrapper>
        {loading ? (
          <Spinner />
        ) : (
          <StyledComboboxList>
            {collection.items.map((resource) => (
              <StyledComboboxItem
                key={collection.getItemValue(resource)}
                item={resource}
                onClick={() => onResourceSelect(resource as Resource)}
                className="peer"
                asChild
              >
                <StyledListItemRoot context="list">
                  <TextWrapper>
                    <ComboboxItemText>{parse(resource.htmlTitle)}</ComboboxItemText>
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
                  </TextWrapper>
                  <ContentTypeBadge contentType={resource.contentType} />
                </StyledListItemRoot>
              </StyledComboboxItem>
            ))}
          </StyledComboboxList>
        )}
        <StyledPaginationRoot
          page={searchObject.page}
          onPageChange={(details) => {
            setSearchObject((prev) => ({ ...prev, page: details.page }));
            setDelayedSearchObject((prev) => ({ ...prev, page: details.page }));
          }}
          count={searchResult.search?.totalCount ?? 0}
          siblingCount={2}
          pageSize={searchObject.pageSize}
          translations={paginationTranslations}
        >
          <PaginationPrevTrigger asChild>
            <IconButton variant="tertiary" aria-label={t("pagination.prev")} title={t("pagination.prev")} size="small">
              <ArrowLeftShortLine />
            </IconButton>
          </PaginationPrevTrigger>
          <PaginationContext>
            {(pagination) =>
              pagination.pages.map((page, index) =>
                page.type === "page" ? (
                  <PaginationItem key={index} {...page} asChild>
                    <Button size="small" variant={page.value === pagination.page ? "primary" : "tertiary"}>
                      {page.value}
                    </Button>
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
            <IconButton variant="tertiary" aria-label={t("pagination.next")} title={t("pagination.next")} size="small">
              <ArrowRightShortLine />
            </IconButton>
          </PaginationNextTrigger>
        </StyledPaginationRoot>
      </StyledComboboxContent>
    </ComboboxRoot>
  );
};
