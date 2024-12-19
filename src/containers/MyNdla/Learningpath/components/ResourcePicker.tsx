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
import { SearchLine } from "@ndla/icons";
import {
  Button,
  ComboboxContentStandalone,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  ListItemRoot,
  Spinner,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeBadge, useComboboxTranslations } from "@ndla/ui";
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
  const [query, setQuery] = useState("");
  const [delayedSearchQuery, setDelayedQuery] = useState("");
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<GQLSearchQuery, GQLSearchQueryVariables>(
    searchQuery,
    {
      fetchPolicy: "no-cache",
    },
  );

  const { refetch } = useFetchOembed({ skip: true });

  const comboboxTranslations = useComboboxTranslations();
  const formId = useId();

  const searchHits = useMemo(() => {
    if (!query.length) return [];
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
  }, [query.length, searchResult.search?.results]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: searchHits,
        itemToValue: (item) => item.path,
        itemToString: (item) => item.title,
      }),
    [searchHits],
  );

  const onSearch = () => {
    runSearch({
      variables: {
        query: query,
      },
    });
  };

  const onQueryChange = (val: string) => {
    setQuery(val);
    debounceCall(() => setDelayedQuery(val));
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
      breadcrumbs: resource.contexts[0]?.breadcrumbs,
    });
  };

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
          resourceTypes: [
            RESOURCE_TYPE_LEARNING_PATH,
            RESOURCE_TYPE_SUBJECT_MATERIAL,
            RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
          ].join(),
        },
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ComboboxRoot
      collection={collection}
      translations={comboboxTranslations}
      highlightedValue={highlightedValue}
      onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
      onInputValueChange={(details) => onQueryChange(details.inputValue)}
      inputValue={query}
      variant="complex"
      context="standalone"
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
                if (e.key === "Enter" && !highlightedValue) {
                  onSearch();
                }
              }}
            />
          </ComboboxInput>
        </InputContainer>
        <IconButton
          variant="secondary"
          type="submit"
          aria-label={t("searchPage.search")}
          title={t("searchPage.search")}
        >
          <SearchLine />
        </IconButton>
      </ComboboxControl>
      <HitsWrapper aria-live="assertive">
        {!loading && !!query && (
          <div>
            {!(searchHits.length > 1) ? (
              <Text textStyle="label.small">{t("searchPage.noHitsShort", { query: query })}</Text>
            ) : (
              <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${query}"`}</Text>
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
        )}
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
                onClick={async () => onResourceSelect(resource as Resource)}
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
        </StyledComboboxContent>
      ) : null}
    </ComboboxRoot>
  );
};
