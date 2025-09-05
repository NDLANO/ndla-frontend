/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { debounce } from "lodash-es";
import { FormEvent, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { ArrowRightLine, CloseLine, SearchLine } from "@ndla/icons";
import {
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
import { constants, ContentTypeBadge, useComboboxTranslations } from "@ndla/ui";
import {
  GQLCurrentContextQuery,
  GQLCurrentContextQueryVariables,
  GQLMastheadSearchQuery,
  GQLMastheadSearchQueryVariables,
} from "../../../graphqlTypes";
import { isValidContextId } from "../../../util/urlHelper";
import { mastheadSearchInputId } from "../mastheadUtils";

interface Props {
  onClose: VoidFunction;
}

const StyledComboboxContent = styled(ComboboxContentStandalone, {
  base: {
    maxHeight: "surface.medium",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    textAlign: "start",
    flexWrap: "wrap",
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
  const stripped = id.replace("urn:subject:", "");
  const searchParams = new URLSearchParams({
    subjects: stripped,
    query: query,
  });
  return `/search?${searchParams}`;
};

const currentContextQueryDef = gql`
  query currentContext($contextId: String!) {
    root: node(contextId: $contextId) {
      id
      nodeType
      name
      context {
        contextId
        rootId
        root
      }
    }
  }
`;

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
          htmlTitle
        }
        ... on LearningpathSearchResult {
          htmlTitle
        }
        contexts {
          contextId
          isPrimary
          breadcrumbs
          url
          resourceTypes {
            id
          }
        }
      }
    }
  }
`;

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

export const MastheadSearchForm = ({ onClose }: Props) => {
  const [query, setQuery] = useState("");
  const [delayedSearchQuery, setDelayedQuery] = useState("");
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);

  const formId = useId();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const comboboxTranslations = useComboboxTranslations();
  const { contextId } = useParams();

  const currentContextQuery = useQuery<GQLCurrentContextQuery, GQLCurrentContextQueryVariables>(
    currentContextQueryDef,
    {
      variables: {
        contextId: contextId ?? "",
      },
      skip: !isValidContextId(contextId) || typeof window === "undefined",
    },
  );

  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<
    GQLMastheadSearchQuery,
    GQLMastheadSearchQueryVariables
  >(searchQuery, { fetchPolicy: "no-cache" });

  const rootSubject = useMemo(() => {
    const root = currentContextQuery.data?.root;
    if (!root) return undefined;
    if (root.nodeType === "SUBJECT") {
      return root;
    }
    if (root.context) {
      return {
        id: root.context?.rootId,
        name: root.context.root,
      };
    }
    return undefined;
  }, [currentContextQuery.data?.root]);

  const searchHits = useMemo(() => {
    if (!query.length) return [];
    return (
      searchResult.search?.results.map((result) => {
        const context = result.contexts.find((context) => context.isPrimary) ?? result.contexts[0];
        let contentType = undefined;
        if (result.__typename === "NodeSearchResult") {
          contentType = constants.contentTypes.SUBJECT;
        }
        if (context?.resourceTypes?.length) {
          contentType = constants.contentTypeMapping?.[context.resourceTypes[0]?.id ?? "default"];
        } else if (context?.url.startsWith("/e")) {
          contentType = constants.contentTypeMapping[constants.contentTypes.TOPIC] ?? "default";
        }
        return {
          ...result,
          htmlTitle:
            result.__typename === "ArticleSearchResult" || result.__typename === "LearningpathSearchResult"
              ? parse(result.htmlTitle)
              : result.title,
          resourceType: context?.resourceTypes?.[0]?.id,
          contentType,
          path: context?.url ?? result.url,
        };
      }) ?? []
    );
  }, [query.length, searchResult.search?.results]);

  const searchString = new URLSearchParams(query?.length ? { query: encodeURIComponent(query) } : undefined).toString();

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: { query: delayedSearchQuery, language: i18n.language },
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  const onQueryChange = (query: string) => {
    setQuery(query);
    debounceCall(() => setDelayedQuery(query));
  };

  const onNavigate = () => {
    onClose();
    setQuery("");
  };

  const onSearch = (evt?: FormEvent) => {
    evt?.preventDefault();

    onClose();
    navigate({ pathname: "/search", search: `?${searchString}` });
  };

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
        onInputValueChange={(details) => onQueryChange(details.inputValue)}
        onInteractOutside={(e) => e.preventDefault()}
        positioning={{ strategy: "fixed" }}
        context="composite"
        variant="complex"
        closeOnSelect
        form={formId}
        selectionBehavior="preserve"
        translations={comboboxTranslations}
        css={{ width: "100%", gap: "xsmall" }}
        ids={{ input: mastheadSearchInputId }}
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
        {!loading && !!query && rootSubject ? (
          <ActiveSubjectWrapper>
            <SearchLine />
            <div>
              <InlineText textStyle="label.small">{t("masthead.activeSubjectSearch")}</InlineText>
              <StyledSafeLink to={getActiveSubjectUrl(rootSubject.id, query)} onClick={() => onNavigate()}>
                &quot;<span>{rootSubject.name}</span>&quot;
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
                <ComboboxItem key={resource.id} item={resource} className="peer" asChild consumeCss>
                  <StyledListItemRoot context="list">
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
                      {resource.contentType === constants.contentTypes.SUBJECT ? (
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
                            {resource.contexts[0].breadcrumbs.join(" / ")}
                          </Text>
                        )
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
