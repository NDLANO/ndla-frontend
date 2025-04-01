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
import { useState, useEffect, FormEvent, useMemo, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { CloseLine, ArrowRightLine, SearchLine } from "@ndla/icons";
import {
  Button,
  ComboboxControl,
  ComboboxInput,
  ComboboxLabel,
  ComboboxRoot,
  DialogCloseTrigger,
  DialogContent,
  DialogRoot,
  DialogTrigger,
  IconButton,
  InputContainer,
  Input,
  ComboboxItem,
  ComboboxItemText,
  Spinner,
  DialogTitle,
  NdlaLogoText,
  Text,
  ListItemRoot,
  ComboboxContentStandalone,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadge, useComboboxTranslations } from "@ndla/ui";
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from "../../../constants";
import { GQLMastheadDrawer_RootFragment, GQLSearchQuery, GQLSearchQueryVariables } from "../../../graphqlTypes";
import { searchQuery } from "../../../queries";
import { contentTypeMapping } from "../../../util/getContentType";

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
    paddingBlock: "medium",
    paddingInline: "medium",
    display: "flex",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: "3xsmall",
    desktop: {
      width: "60%",
    },
  },
});

const StyledDialogContent = styled(DialogContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "unset",
  },
});

const LogoWrapper = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    paddingBlock: "medium",
  },
});

const LabelContainer = styled("div", {
  base: {
    display: "flex",
    gap: "medium",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: "3xsmall",
    textAlign: "start",
  },
});

const SearchContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const SuggestionButton = styled(Button, {
  base: {
    marginInlineStart: "3xsmall",
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
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
    _focusVisible: {
      textDecoration: "none",
    },
  },
});

const InlineText = styled(Text, {
  base: {
    display: "inline",
    marginInlineEnd: "4xsmall",
  },
});

const getActiveSubjectUrl = (id: string): string => {
  const stripped = id.replace("urn:subject:", "");
  return `/search?type=resource&subjects=${encodeURIComponent(stripped)}`;
};

interface Props {
  root?: GQLMastheadDrawer_RootFragment;
}
const MastheadSearch = ({ root }: Props) => {
  const [dialogState, setDialogState] = useState({ open: false });
  const [highlightedValue, setHighligtedValue] = useState<string | null>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [delayedSearchQuery, setDelayedQuery] = useState("");
  const formId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const comboboxTranslations = useComboboxTranslations();
  const dialogTriggerRef = useRef<HTMLButtonElement>(null);

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
          resourceTypes: [
            RESOURCE_TYPE_LEARNING_PATH,
            RESOURCE_TYPE_SUBJECT_MATERIAL,
            RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
          ].join(),
          license: "all",
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
        const contentType = contentTypeMapping?.[context?.resourceTypes?.[0]?.id ?? "default"];
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
    query: query && query.length > 0 ? query : undefined,
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

  const suggestion = searchResult?.search?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

  return (
    <DialogRoot
      open={dialogState.open}
      variant="drawer"
      position="top"
      size="xsmall"
      onOpenChange={setDialogState}
      initialFocusEl={() => inputRef.current}
      finalFocusEl={() => dialogTriggerRef.current}
    >
      <DialogTrigger asChild ref={dialogTriggerRef}>
        <StyledButton variant="tertiary" aria-label={t("masthead.menu.search")} title={t("masthead.menu.search")}>
          <SearchLine />
          <span>{t("masthead.menu.search")}</span>
        </StyledButton>
      </DialogTrigger>
      <StyledDialogContent aria-label={t("searchPage.searchFieldPlaceholder")}>
        <LogoWrapper>
          <NdlaLogoText />
        </LogoWrapper>
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
            css={{ width: "100%" }}
          >
            <LabelContainer>
              <DialogTitle asChild>
                <ComboboxLabel>{t("masthead.search")}</ComboboxLabel>
              </DialogTitle>
              <DialogCloseTrigger asChild>
                <Button variant="tertiary">
                  {t("siteNav.close")}
                  <CloseLine />
                </Button>
              </DialogCloseTrigger>
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
            <SearchContentWrapper>
              <StyledHitsWrapper aria-live="assertive">
                {!loading && !!query && (
                  <div>
                    {!(searchHits.length >= 1) ? (
                      <Text textStyle="label.small">{`${t("searchPage.noHitsShort", { query: "" })} ${query}`}</Text>
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
              </StyledHitsWrapper>
              {!loading && !!query && root ? (
                <ActiveSubjectWrapper>
                  <SearchLine />
                  <div>
                    <InlineText textStyle="label.small">{t("masthead.activeSubjectSearch")}</InlineText>
                    {/* TODO: Figure out if we should handle this differently to avoid onClick on anchor tag */}
                    <StyledSafeLink to={getActiveSubjectUrl(root.id)} onClick={() => setDialogState({ open: false })}>
                      {root.name}
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
                            <ComboboxItemText>
                              <SafeLink to={resource.path} onClick={onNavigate} unstyled css={linkOverlay.raw()}>
                                {resource.htmlTitle}
                              </SafeLink>
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
                          </TextWrapper>
                          <ContentTypeBadge contentType={resource.contentType} />
                        </StyledListItemRoot>
                      </ComboboxItem>
                    ))
                  )}
                </StyledComboboxContent>
              ) : null}
            </SearchContentWrapper>
          </ComboboxRoot>
          {!!searchHits.length && !loading && (
            <Button variant="secondary" type="submit">
              {t("masthead.moreHits")}
              <ArrowRightLine />
            </Button>
          )}
        </StyledForm>
      </StyledDialogContent>
    </DialogRoot>
  );
};

export default MastheadSearch;
