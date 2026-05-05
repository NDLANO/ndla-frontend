/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { createListCollection, usePopoverContext } from "@ark-ui/react";
import { ArrowRightLine, CloseLine, SearchLine } from "@ndla/icons";
import {
  Badge,
  Button,
  ComboboxContentStandalone,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxRoot,
  IconButton,
  Input,
  InputContainer,
  ListItemRoot,
  PopoverCloseTrigger,
  PopoverTitle,
  Spinner,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { BadgesContainer, useComboboxTranslations } from "@ndla/ui";
import parse from "html-react-parser";
import { SubmitEvent, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { GQLMastheadSearchQuery, GQLMastheadSearchQueryVariables } from "../../graphqlTypes";
import { getListItemTraits } from "../../util/listItemTraits";
import { toSearchParams } from "../../util/searchHelpers";
import { useDebounce } from "../../util/useDebounce";

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    maxHeight: "surface.medium",
    gap: "xxsmall",
  },
});

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    minHeight: "unset",
    flexDirection: "column",
    gap: "4xsmall",
    "& > *": {
      width: "100%",
    },
  },
});

const StyledBadgesContainer = styled(BadgesContainer, {
  base: {
    marginBlockStart: "xsmall",
  },
});

const StyledForm = styled("form", {
  base: {
    width: "100%",
    flex: "1",
    paddingBlockStart: "medium",
    paddingBlockEnd: "large",
    paddingInline: "xxlarge",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "xsmall",
    overflow: "auto",
    desktop: {
      width: "60%",
    },
  },
});

const LabelContainer = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    justifyContent: "space-between",
    alignItems: "center",
    marginBlockEnd: "xsmall",
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

const StyledHitsWrapper = styled("div", {
  base: {
    textAlign: "start",
  },
});

const ActiveSubjectWrapper = styled("div", {
  base: {
    border: "1px solid",
    borderColor: "stroke.subtle",
    backgroundColor: "surface.brand.1.subtle",
    display: "flex",
    gap: "3xsmall",
    padding: "xsmall",
    alignItems: "center",
    textAlign: "start",
    tabletDown: {
      gap: "4xsmall",
    },
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "inline",
    color: "text.default",
    textStyle: "label.small",
    "& span": {
      textDecoration: "underline",
      _hover: {
        textDecoration: "none",
      },
      _focusVisible: {
        textDecoration: "none",
      },
    },
  },
});

const InlineText = styled(Text, {
  base: {
    display: "inline",
    marginInlineEnd: "4xsmall",
  },
});

const StyledMoreHitsButton = styled(Button, {
  base: {
    marginBlockStart: "small",
  },
});

type SearchResult = Omit<NonNullable<GQLMastheadSearchQuery["search"]>["results"][number], "__typename"> & {
  htmlTitle: ReturnType<typeof parse> | string;
  isSubject: boolean;
  traits: string[];
};

const StyledComboboxRoot = styled(ComboboxRoot<SearchResult>, {
  base: {
    width: "100%",
    gap: "xsmall",
  },
});

const getActiveSubjectUrl = (id: string, query: string): string => {
  const searchParams = new URLSearchParams({
    query: query,
  });
  if (id.includes("programme")) {
    searchParams.set("programmes", id);
  }
  if (id.includes("subject")) {
    searchParams.set("subjects", id.replace("urn:subject:", ""));
  }
  return `/search?${searchParams}`;
};

const searchQuery = gql`
  query mastheadSearch($query: String, $language: String) {
    search(
      query: $query
      language: $language
      contextTypes: "standard,learningpath,topic-article,node"
      fallback: "true"
      filterInactive: true
      license: "all"
      nodeTypes: "SUBJECT"
      page: 1
      pageSize: 10
      resultTypes: "node,article,learningpath"
    ) {
      results {
        id
        title
        url
        metaDescription
        ... on ArticleSearchResult {
          traits
          htmlTitle
        }
        ... on LearningpathSearchResult {
          traits
          htmlTitle
        }
        context {
          contextId
          isPrimary
          breadcrumbs
          url
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
  root: { id: string; name: string } | undefined;
}

export const MastheadSearchForm = ({ root }: Props) => {
  const { t, i18n } = useTranslation();
  const { setOpen } = usePopoverContext();
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const formId = useId();
  const comboboxTranslations = useComboboxTranslations();
  const [query, setQuery] = useState("");
  const delayedSearchQuery = useDebounce(query, 250);
  const navigate = useNavigate();

  const { loading, data: searchResult = {} } = useQuery<GQLMastheadSearchQuery, GQLMastheadSearchQueryVariables>(
    searchQuery,
    {
      skip: delayedSearchQuery.length <= 2,
      variables: { query: delayedSearchQuery, language: i18n.language },
    },
  );

  const onSearch = (evt?: SubmitEvent) => {
    evt?.preventDefault();
    setOpen(false);
    navigate({ pathname: "/search", search: `?${toSearchParams({ query }).toString()}` });
  };

  const searchHits: SearchResult[] = useMemo(() => {
    if (!query.length || !searchResult.search?.results?.length) return [];
    return searchResult.search.results.map((result) => {
      const traits = getListItemTraits(
        {
          relevanceId: result.context?.relevanceId,
          resourceTypes: result.context?.resourceTypes,
          resourceType:
            result.__typename === "NodeSearchResult" ? "subject" : result.url.startsWith("/e/") ? "topic" : undefined,
          traits: "traits" in result ? result.traits : undefined,
        },
        t,
      );
      return {
        ...result,
        htmlTitle: "htmlTitle" in result ? parse(result.htmlTitle) : result.title,
        isSubject: result.__typename === "NodeSearchResult",
        traits,
      };
    });
  }, [query.length, searchResult.search?.results, t]);

  const collection = useMemo(
    () =>
      createListCollection<SearchResult>({
        items: searchHits,
        itemToValue: (item) => item.url,
        itemToString: (item) => item.title,
      }),
    [searchHits],
  );

  return (
    <StyledForm role="search" onSubmit={onSearch} id={formId}>
      <StyledComboboxRoot
        defaultOpen
        onOpenChange={(details) => setOpen(details.open)}
        navigate={(details) => navigate({ pathname: details.value })}
        collection={collection}
        highlightedValue={highlightedValue}
        onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onFocusOutside={(e) => e.preventDefault()}
        context="composite"
        variant="complex"
        form={formId}
        selectionBehavior="preserve"
        translations={comboboxTranslations}
      >
        <LabelContainer>
          <PopoverTitle asChild>
            <ComboboxLabel>{t("masthead.search")}</ComboboxLabel>
          </PopoverTitle>
          <PopoverCloseTrigger asChild>
            <Button variant="tertiary">
              {t("siteNav.close")}
              <CloseLine />
            </Button>
          </PopoverCloseTrigger>
        </LabelContainer>
        <ComboboxControl>
          <InputContainer>
            <ComboboxInput asChild>
              <Input
                placeholder={t("searchPage.searchFieldPlaceholder")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !highlightedValue) {
                    onSearch();
                    e.preventDefault();
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
        <StyledHitsWrapper aria-live="assertive">
          {!loading && !!query && (
            <div>
              {!(searchHits.length >= 1) ? (
                <Text textStyle="label.small">{`${t("searchPage.noHitsShort", { query: "" })} ${query}`}</Text>
              ) : (
                <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${query}"`}</Text>
              )}
            </div>
          )}
        </StyledHitsWrapper>
        {!loading && !!query && root ? (
          <ActiveSubjectWrapper>
            <SearchLine />
            <div>
              <InlineText textStyle="label.small">
                {root.id.includes("programme")
                  ? t("masthead.activeProgrammeSearch")
                  : t("masthead.activeSubjectSearch")}
              </InlineText>
              <StyledSafeLink to={getActiveSubjectUrl(root.id, query)}>
                &quot;<span>{root.name}</span>&quot;
              </StyledSafeLink>
            </div>
          </ActiveSubjectWrapper>
        ) : null}
        <StyledComboboxContent>
          {loading ? (
            <Spinner />
          ) : (
            searchHits.map((resource) => (
              <StyledComboboxItem key={resource.id} item={resource} asChild>
                <ListItemRoot asChild>
                  <SafeLink
                    to={resource.url}
                    // used by matomo
                    data-search-item
                    onKeyDown={(e) => e.preventDefault()}
                  >
                    <ComboboxItemText>{resource.htmlTitle}</ComboboxItemText>
                    <TextWrapper>
                      {resource.isSubject ? (
                        <Text textStyle="label.small" color="text.subtle">
                          {resource.metaDescription}
                        </Text>
                      ) : (
                        !!resource.context && (
                          <Text
                            textStyle="label.small"
                            color="text.subtle"
                            aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.context?.breadcrumbs.join(", ")}`}
                          >
                            {resource.context.breadcrumbs.join(" › ")}
                          </Text>
                        )
                      )}
                    </TextWrapper>
                    <StyledBadgesContainer>
                      {resource.traits.map((trait) => (
                        <Badge size="small" key={`${resource.id}-${trait}`}>
                          {trait}
                        </Badge>
                      ))}
                    </StyledBadgesContainer>
                  </SafeLink>
                </ListItemRoot>
              </StyledComboboxItem>
            ))
          )}
        </StyledComboboxContent>
      </StyledComboboxRoot>
      {!!searchHits.length && !loading && (
        <StyledMoreHitsButton variant="secondary" type="submit">
          {t("masthead.moreHits")}
          <ArrowRightLine />
        </StyledMoreHitsButton>
      )}
    </StyledForm>
  );
};

export default MastheadSearchForm;
