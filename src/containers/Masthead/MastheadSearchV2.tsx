/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { debounce } from "lodash-es";
import queryString from "query-string";
import { useState, useEffect, FormEvent, useMemo, useId, useRef, CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { useComponentSize } from "@ndla/hooks";
import { CloseLine, ArrowRightLine, SearchLine } from "@ndla/icons";
import {
  Button,
  ComboboxControl,
  ComboboxInput,
  ComboboxLabel,
  ComboboxRoot,
  IconButton,
  InputContainer,
  Input,
  ComboboxItem,
  ComboboxItemText,
  Spinner,
  Text,
  ListItemRoot,
  ComboboxContentStandalone,
  PopoverRoot,
  PopoverTrigger,
  PopoverCloseTrigger,
  PopoverTitle,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { constants, ContentTypeBadge, useComboboxTranslations } from "@ndla/ui";
import { MastheadPopoverBackdrop, MastheadPopoverContent } from "./MastheadPopover";
import {
  GQLCurrentContextQuery,
  GQLCurrentContextQueryVariables,
  GQLSearchQuery,
  GQLSearchQueryVariables,
} from "../../graphqlTypes";
import { searchQuery } from "../../queries";
import { isValidContextId } from "../../util/urlHelper";

const debounceCall = debounce((fun: (func?: VoidFunction) => void) => fun(), 250);

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

const StyledButton = styled(Button, {
  base: {
    tabletDown: {
      paddingInline: "xsmall",
      "& span": {
        display: "none",
      },
    },
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

const MastheadSearch = () => {
  const [dialogState, setDialogState] = useState({ open: false });
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { contextId } = useParams();
  const [query, setQuery] = useState("");
  const [delayedSearchQuery, setDelayedQuery] = useState("");
  const formId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxTranslations = useComboboxTranslations();
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

  const { height } = useComponentSize("masthead");

  const style = useMemo(() => ({ "--masthead-height": `${height}px` }) as CSSProperties, [height]);

  const currentContextQuery = useQuery<GQLCurrentContextQuery, GQLCurrentContextQueryVariables>(
    currentContextQueryDef,
    {
      variables: {
        contextId: contextId ?? "",
      },
      skip: !isValidContextId(contextId) || typeof window === "undefined",
    },
  );

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

  useEffect(() => {
    setQuery("");
  }, [pathname]);

  useEffect(() => {
    const onSlashPressed = (evt: KeyboardEvent) => {
      if (
        evt.key === "/" &&
        !["input", "textarea"].includes(document.activeElement?.tagName?.toLowerCase() ?? "") &&
        document.activeElement?.attributes.getNamedItem("contenteditable")?.value !== "true" &&
        !dialogState.open
      ) {
        evt.preventDefault();
        setDialogState({ open: true });
      }
    };
    window.addEventListener("keydown", onSlashPressed);
    return () => window.removeEventListener("keydown", onSlashPressed);
  }, [dialogState.open]);

  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<GQLSearchQuery, GQLSearchQueryVariables>(
    searchQuery,
    { fetchPolicy: "no-cache" },
  );

  useEffect(() => {
    if (delayedSearchQuery.length >= 2) {
      runSearch({
        variables: {
          query: delayedSearchQuery,
          contextTypes: "standard,learningpath,topic-article,node",
          fallback: "true",
          filterInactive: true,
          license: "all",
          language: i18n.language,
          nodeTypes: "SUBJECT",
          page: 1,
          pageSize: 10,
          resultTypes: "node,article,learningpath",
        },
      });
    }
  }, [delayedSearchQuery]); // eslint-disable-line react-hooks/exhaustive-deps

  const onQueryChange = (query: string) => {
    setQuery(query);
    debounceCall(() => setDelayedQuery(query));
  };

  const onNavigate = () => {
    setDialogState({ open: false });
    setQuery("");
  };

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

  const searchString = queryString.stringify({
    query: query && query.length > 0 ? encodeURIComponent(query) : undefined,
  });

  const onSearch = (evt?: FormEvent) => {
    evt?.preventDefault();

    setDialogState({ open: false });
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
    <PopoverRoot open={dialogState.open} onOpenChange={setDialogState} initialFocusEl={() => inputRef.current}>
      <PopoverTrigger asChild ref={dialogTriggerRef}>
        <StyledButton variant="tertiary" aria-label={t("masthead.menu.search")} title={t("masthead.menu.search")}>
          <SearchLine />
          <span>{t("masthead.menu.search")}</span>
        </StyledButton>
      </PopoverTrigger>
      <MastheadPopoverContent aria-label={t("searchPage.searchFieldPlaceholder")} style={style}>
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
                <ComboboxInput asChild ref={inputRef}>
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
      </MastheadPopoverContent>
      <MastheadPopoverBackdrop present={dialogState.open} style={style} />
    </PopoverRoot>
  );
};

export default MastheadSearch;
