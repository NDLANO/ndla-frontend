/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { t } from "i18next";
import debounce from "lodash/debounce";
import { useState, useId, useMemo, useEffect } from "react";
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
  ComboboxRoot,
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
import { ResourceData } from "./ResourceForm";
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
    maxHeight: "surface.medium",
    gap: "medium",
  },
});

const ContentWrapper = styled("div", {
  base: {
    boxShadow: "large",
    padding: "small",
    backgroundColor: "background.default",
    borderRadius: "xsmall",
  },
});

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

interface Props {
  setResource: (data: ResourceData) => void;
}

type Resource = GQLSearchResult & {
  id: string;
  resourceType?: string;
  contentType?: string;
  path: string;
};

export const ResourcePicker = ({ setResource }: Props) => {
  const [searchObject, setSearchObject] = useState({ page: 1, pageSize: 10, query: "" });
  const [delayedSearchObject, setDelayedSearchObject] = useState({ page: 1, pageSize: 10, query: "" });
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<GQLSearchQuery, GQLSearchQueryVariables>(
    searchQuery,
    {
      fetchPolicy: "no-cache",
    },
  );

  const { refetch } = useFetchOembed({ skip: true });

  const paginationTranslations = usePaginationTranslations();
  const comboboxTranslations = useComboboxTranslations();
  const formId = useId();

  const searchHits = useMemo(() => {
    if (!searchObject.query.length) return [];
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
  }, [searchObject.query.length, searchResult.search?.results]);

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
    if (delayedSearchObject.query.length >= 2) {
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
    }
  }, [delayedSearchObject]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ComboboxRoot
      collection={collection}
      translations={comboboxTranslations}
      highlightedValue={highlightedValue}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      onInputValueChange={(details) => onQueryChange(details.inputValue)}
      inputValue={searchObject.query}
      variant="complex"
      context="composite"
      closeOnSelect
      form={formId}
      selectionBehavior="preserve"
    >
      <ComboboxControl>
        <InputContainer>
          <ComboboxInput asChild>
            <Input
              placeholder={t("searchPage.searchFieldPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (!highlightedValue) {
                    onSearch();
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
      {searchObject.query ? (
        <ContentWrapper>
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
          {!!searchHits.length || loading ? (
            <StyledComboboxContent>
              {loading ? (
                <Spinner />
              ) : (
                searchHits.map((resource) => (
                  <ComboboxItem
                    key={resource.id}
                    item={resource}
                    onClick={() => onResourceSelect(resource as Resource)}
                    className="peer"
                    asChild
                    consumeCss
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
                  </ComboboxItem>
                ))
              )}
              <PaginationRoot
                page={searchObject.page}
                onPageChange={(details) => {
                  setSearchObject((prev) => ({ ...prev, page: details.page }));
                  setDelayedSearchObject((prev) => ({ ...prev, page: details.page }));
                }}
                count={searchResult.search?.totalCount ?? 0}
                pageSize={10}
                translations={paginationTranslations}
                siblingCount={2}
                aria-label={t("podcastPage.paginationNav")}
              >
                <PaginationPrevTrigger asChild>
                  <Button variant="tertiary" aria-label={t("pagination.prev")} title={t("pagination.prev")}>
                    <ArrowLeftShortLine />
                    <span>{t("pagination.prev")}</span>
                  </Button>
                </PaginationPrevTrigger>
                <PaginationContext>
                  {(pagination) =>
                    pagination.pages.map((page, index) =>
                      page.type === "page" ? (
                        <PaginationItem key={index} {...page} asChild>
                          <Button variant={page.value === pagination.page ? "primary" : "tertiary"}>
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
                  <Button variant="tertiary" aria-label={t("pagination.next")} title={t("pagination.next")}>
                    <span>{t("pagination.next")}</span>
                    <ArrowRightShortLine />
                  </Button>
                </PaginationNextTrigger>
              </PaginationRoot>
            </StyledComboboxContent>
          ) : null}
        </ContentWrapper>
      ) : null}
    </ComboboxRoot>
  );
};
