/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import debounce from "lodash/debounce";
import queryString from "query-string";
import { useState, useEffect, FormEvent, useMemo, useId, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { createListCollection } from "@ark-ui/react";
import { CloseLine } from "@ndla/icons/action";
import { ArrowRightLine, SearchLine } from "@ndla/icons/common";
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
  ComboboxContent,
  ComboboxItem,
  ComboboxItemText,
  Spinner,
  DialogTitle,
  NdlaLogoText,
  Text,
  ListItemRoot,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ContentTypeBadgeNew, useComboboxTranslations } from "@ndla/ui";
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from "../../../constants";
import { GQLSearchQuery, GQLSearchQueryVariables } from "../../../graphqlTypes";
import { searchQuery } from "../../../queries";
import { contentTypeMapping } from "../../../util/getContentType";

const debounceCall = debounce((fun: (func?: Function) => void) => fun(), 250);

const StyledComboboxContent = styled(ComboboxContent, {
  base: {
    maxHeight: "surface.medium",
  },
});

const StyledListItemRoot = styled(ListItemRoot, {
  base: {
    minHeight: "unset",
    textAlign: "start",
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

const StyledHitsWrapper = styled("div", { base: { marginTop: "3xsmall", textAlign: "start" } });

const SuggestionButton = styled(Button, {
  base: {
    marginInlineStart: "3xsmall",
  },
});

const MastheadSearch = () => {
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
        !["input", "textarea"].includes(document.activeElement?.tagName.toLowerCase() ?? "") &&
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

  const mappedItems = useMemo(() => {
    if (!query.length) return [];
    return (
      searchResult.search?.results.map((result) => {
        const resourceType = result.contexts.find((context) => context.isPrimary)?.resourceTypes?.[0];
        const contentType = contentTypeMapping?.[resourceType?.id ?? "default"];
        return {
          ...result,
          id: result.id.toString(),
          resourceType: resourceType?.id,
          contentType,
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
      createListCollection({ items: mappedItems, itemToValue: (item) => item.url, itemToString: (item) => item.title }),
    [mappedItems],
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
            variant="composite"
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
              {!loading && query && (
                <div>
                  {!(mappedItems.length > 1) ? (
                    <Text textStyle="label.small">{t("searchPage.noHitsShort", { query: query })}</Text>
                  ) : (
                    <Text textStyle="label.small">{`${t("searchPage.resultType.showingSearchPhrase")} "${query}"`}</Text>
                  )}
                  {suggestion && (
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
            {!!mappedItems.length || loading ? (
              <StyledComboboxContent>
                {loading ? (
                  <Spinner />
                ) : (
                  mappedItems.map((resource) => (
                    <ComboboxItem key={resource.id} item={resource} className="peer" asChild consumeCss>
                      <StyledListItemRoot context="list">
                        <TextWrapper>
                          <ComboboxItemText>
                            <SafeLink to={resource.url} onClick={onNavigate} unstyled css={linkOverlay.raw()}>
                              {resource.title}
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
                        <ContentTypeBadgeNew contentType={resource.contentType} />
                      </StyledListItemRoot>
                    </ComboboxItem>
                  ))
                )}
              </StyledComboboxContent>
            ) : null}
          </ComboboxRoot>
          {!!mappedItems.length && !loading && (
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
