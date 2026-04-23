/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createListCollection } from "@ark-ui/react";
import { ArrowRightLine, SearchLine } from "@ndla/icons";
import {
  Badge,
  ComboboxContentStandalone,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxPositioner,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  ListItemRoot,
  Spinner,
  Text,
} from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { BadgesContainer, useComboboxTranslations } from "@ndla/ui";
import { TFunction } from "i18next";
import { SubmitEvent, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { GQLSubjectSearchQuery, GQLSubjectSearchQueryVariables } from "../../graphqlTypes";
import { getListItemTraits } from "../../util/listItemTraits";
import { scrollToIndexFn } from "../../util/scrollToIndexFn";
import { toSearchParams } from "../../util/searchHelpers";
import { useDebounce } from "../../util/useDebounce";

const queryDef = gql`
  query subjectSearch($query: String!, $subjectId: String!, $language: String!) {
    search(query: $query, subjects: $subjectId, language: $language) {
      results {
        id
        title
        url
        metaDescription
        ... on ArticleSearchResult {
          traits
        }
        ... on LearningpathSearchResult {
          traits
        }
        context {
          contextId
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

interface Props {
  subjectId: string;
}

type TransformType = NonNullable<GQLSubjectSearchQuery["search"]>["results"][number];

const transformSearchResult = (result: TransformType, t: TFunction) => {
  const resourceType = result.url.startsWith("/e/") ? "topic" : undefined;
  const traits = getListItemTraits(
    {
      relevanceId: result.context?.relevanceId,
      resourceTypes: result.context?.resourceTypes,
      resourceType,
      traits: "traits" in result ? result.traits : undefined,
    },
    t,
  );
  return {
    ...result,
    traits,
    breadcrumbs: result.context?.breadcrumbs,
    path: result.url,
  };
};

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    minHeight: "unset",
    textAlign: "start",
    flexDirection: "column",
    gap: "4xsmall",
    alignItems: "flex-start",
    flexWrap: "wrap",
  },
});

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    overflowY: "unset",
    maxHeight: "surface.medium",
    gap: "xxsmall",
  },
});

const StyledComboboxList = styled(ComboboxList, {
  base: {
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    gap: "xxsmall",
  },
});

const toSearch = (query: string, subjectId: string) => {
  const params = toSearchParams({ query, subjectIds: [subjectId] });
  return `/search?${params.toString()}`;
};

export const SubjectSearch = ({ subjectId }: Props) => {
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const delayedQuery = useDebounce(searchQuery, 250);
  const contentRef = useRef<HTMLDivElement>(null);
  const { t, i18n } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const query = useQuery<GQLSubjectSearchQuery, GQLSubjectSearchQueryVariables>(queryDef, {
    variables: { query: delayedQuery, subjectId, language: i18n.language },
    skip: delayedQuery.length < 2,
  });
  const navigate = useNavigate();
  const formId = useId();

  const items = useMemo(() => {
    return query?.data?.search?.results.map((r) => transformSearchResult(r, t)) ?? [];
  }, [t, query.data]);

  const collection = useMemo(
    () => createListCollection({ items, itemToValue: (i) => i.url, itemToString: (i) => i.title }),
    [items],
  );

  const onSearch = (evt?: SubmitEvent) => {
    evt?.preventDefault();
    navigate(toSearch(searchQuery, subjectId));
  };

  return (
    <form id={formId} onSubmit={onSearch}>
      <ComboboxRoot
        navigate={(details) => navigate({ pathname: details.value })}
        collection={collection}
        variant="complex"
        translations={comboboxTranslations}
        highlightedValue={highlightedValue}
        onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
        scrollToIndexFn={(details) => scrollToIndexFn(contentRef, details.index)}
        inputValue={searchQuery}
        onInputValueChange={(details) => setSearchQuery(details.inputValue)}
        selectionBehavior="preserve"
        form={formId}
      >
        <ComboboxLabel>{t("subjectsPage.searchLabel")}</ComboboxLabel>
        <ComboboxControl>
          <InputContainer>
            <ComboboxInput asChild>
              <Input
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !highlightedValue) {
                    onSearch();
                    e.preventDefault();
                  }
                }}
              />
            </ComboboxInput>
          </InputContainer>
          <IconButton type="submit" variant="secondary" aria-label={t("search")} title={t("search")}>
            <SearchLine />
          </IconButton>
        </ComboboxControl>
        <ComboboxPositioner>
          {!!delayedQuery.length && (
            <StyledComboboxContent ref={contentRef} tabIndex={-1}>
              {query.loading ? (
                <Spinner />
              ) : !items.length ? (
                <Text>{`${t("searchPage.noHitsShort", { query: "" })} ${delayedQuery}`}</Text>
              ) : (
                <>
                  <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${delayedQuery}"`}</Text>
                  <StyledComboboxList>
                    {items.map((item) => (
                      <StyledComboboxItem key={item.path} item={item} asChild>
                        <ListItemRoot asChild>
                          <SafeLink to={item.path} onKeyDown={(e) => e.preventDefault()}>
                            <ComboboxItemText>{item.title}</ComboboxItemText>
                            {!!item.breadcrumbs?.length && (
                              <>
                                <Text srOnly>{`${t("breadcrumb.breadcrumb")}: ${item.breadcrumbs.join(", ")}`}</Text>
                                <Text color="text.subtle" aria-hidden>
                                  {item.breadcrumbs.join(" › ")}
                                </Text>
                              </>
                            )}
                            <BadgesContainer>
                              {item.traits.map((trait) => (
                                <Badge size="small" key={`${item.path}-${trait}`}>
                                  {trait}
                                </Badge>
                              ))}
                            </BadgesContainer>
                          </SafeLink>
                        </ListItemRoot>
                      </StyledComboboxItem>
                    ))}
                  </StyledComboboxList>
                  <SafeLinkButton to={toSearch(delayedQuery, subjectId)} variant="secondary">
                    {t("subjectsPage.moreHits")}
                    <ArrowRightLine />
                  </SafeLinkButton>
                </>
              )}
            </StyledComboboxContent>
          )}
        </ComboboxPositioner>
      </ComboboxRoot>
    </form>
  );
};
