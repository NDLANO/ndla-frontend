/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
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
import { linkOverlay } from "@ndla/styled-system/patterns";
import { BadgesContainer, useComboboxTranslations } from "@ndla/ui";
import { GQLMastheadSearchQuery, GQLMastheadSearchQueryVariables } from "../../graphqlTypes";
import { getListItemTraits } from "../../util/listItemTraits";
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

const StyledComboboxItemText = styled(ComboboxItemText, {
  base: {
    textDecoration: "underline",
    _highlighted: {
      textDecoration: "none",
    },
  },
});

const StyledMoreHitsButton = styled(Button, {
  base: {
    marginBlockStart: "small",
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
        contexts {
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
  // TODO: Maybe we can remove this?
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const { pathname } = useLocation();
  const formId = useId();
  const comboboxTranslations = useComboboxTranslations();
  const [query, setQuery] = useState("");
  const delayedSearchQuery = useDebounce(query, 250);
  const navigate = useNavigate();

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  // TODO: Can we avoid this?
  const onNavigate = () => {
    setOpen(false);
    setQuery("");
  };

  const { loading, data: searchResult = {} } = useQuery<GQLMastheadSearchQuery, GQLMastheadSearchQueryVariables>(
    searchQuery,
    {
      skip: delayedSearchQuery.length <= 2,
      variables: { query: delayedSearchQuery, language: i18n.language },
    },
  );

  const onSearch = (evt?: FormEvent) => {
    evt?.preventDefault();
    const searchString = new URLSearchParams(
      query?.length ? { query: encodeURIComponent(query) } : undefined,
    ).toString();

    setOpen(false);
    navigate({ pathname: "/search", search: `?${searchString}` });
  };

  const searchHits = useMemo(() => {
    if (!query.length) return [];
    return (
      searchResult.search?.results.map((result) => {
        const context = result.contexts.find((context) => context.isPrimary) ?? result.contexts[0];
        const nodeType =
          result.__typename === "NodeSearchResult" ? "subject" : result.url.startsWith("/e/") ? "topic" : undefined;

        const traits = getListItemTraits(
          {
            relevanceId: context?.relevanceId,
            resourceTypes: context?.resourceTypes,
            resourceType: nodeType,
            traits:
              result.__typename === "ArticleSearchResult" || result.__typename === "LearningpathSearchResult"
                ? result.traits
                : undefined,
          },
          t,
        );
        return {
          ...result,
          htmlTitle:
            result.__typename === "ArticleSearchResult" || result.__typename === "LearningpathSearchResult"
              ? parse(result.htmlTitle)
              : result.title,
          isSubject: result.__typename === "NodeSearchResult",
          traits,
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [query.length, searchResult.search?.results, t]);

  const collection = useMemo(
    () =>
      createListCollection({
        items: searchHits,
        itemToValue: (item) => item.path,
        itemToString: (item) => item.title,
      }),
    [searchHits],
  );

  return (
    <StyledForm role="search" action="/search/" onSubmit={onSearch} id={formId}>
      <ComboboxRoot
        defaultOpen
        collection={collection}
        highlightedValue={highlightedValue}
        onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
        inputValue={query}
        onInputValueChange={(details) => setQuery(details.inputValue)}
        onInteractOutside={(e) => e.preventDefault()}
        positioning={{ strategy: "fixed" }}
        context="composite"
        variant="complex"
        closeOnSelect
        form={formId}
        selectionBehavior="preserve"
        translations={comboboxTranslations}
        css={{ width: "100%", gap: "xsmall" }}
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
                  } else if (e.key === "Enter" && highlightedValue) {
                    onNavigate();
                    navigate({ pathname: highlightedValue });
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
              <StyledSafeLink to={getActiveSubjectUrl(root.id, query)} onClick={() => onNavigate()}>
                &quot;<span>{root.name}</span>&quot;
              </StyledSafeLink>
            </div>
          </ActiveSubjectWrapper>
        ) : null}
        {!!searchHits.length || loading ? (
          <StyledComboboxContent>
            {loading ? (
              <Spinner />
            ) : (
              searchHits.map((resource) => (
                <StyledComboboxItem key={resource.id} item={resource} className="peer" asChild>
                  <ListItemRoot>
                    <TextWrapper>
                      <StyledComboboxItemText>
                        <SafeLink
                          to={resource.path}
                          onClick={onNavigate}
                          unstyled
                          css={linkOverlay.raw()}
                          id="matomo-masthead-search-anchor-element"
                        >
                          {resource.htmlTitle}
                        </SafeLink>
                      </StyledComboboxItemText>
                      {resource.isSubject ? (
                        <Text textStyle="label.small" color="text.subtle">
                          {resource.metaDescription}
                        </Text>
                      ) : (
                        !!resource.contexts[0] && (
                          <Text
                            textStyle="label.small"
                            color="text.subtle"
                            css={{ textAlign: "start" }}
                            aria-label={`${t("breadcrumb.breadcrumb")}: ${resource.contexts[0]?.breadcrumbs.join(", ")}`}
                          >
                            {resource.contexts[0].breadcrumbs.join(" › ")}
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
                  </ListItemRoot>
                </StyledComboboxItem>
              ))
            )}
          </StyledComboboxContent>
        ) : null}
      </ComboboxRoot>
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
