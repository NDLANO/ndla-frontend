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
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { ContentTypeBadgeNew, useComboboxTranslations } from "@ndla/ui";
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_LEARNING_PATH,
} from "../../../constants";
import { GQLGroupSearchQuery, GQLGroupSearchQueryVariables } from "../../../graphqlTypes";
import { groupSearchQuery } from "../../../queries";
import { contentTypeMapping } from "../../../util/getContentType";

const debounceCall = debounce((fun: (func?: Function) => void) => fun(), 250);

const StyledComboboxContent = styled(ComboboxContent, {
  base: {
    boxShadow: "none",
    borderRadius: "unset",
    paddingBlock: "unset",
    paddingInline: "unset",
    gap: "0px",
    maxHeight: "surface.medium",
  },
});

const StyledComboboxItem = styled(ComboboxItem, {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "xxsmall",
    transitionProperty: "background-color, border-color",
    transitionDuration: "superFast",
    transitionTimingFunction: "ease-in-out",
    borderTop: "1px solid",
    borderTopColor: "stroke.subtle",
    borderBottom: "1px solid",
    borderBottomColor: "transparent",
    borderRadius: "0",
    _first: {
      borderTopColor: "transparent",
      _hover: {
        borderTopColor: "stroke.hover",
      },
      _highlighted: {
        borderTopColor: "stroke.hover",
      },
    },
    _last: {
      borderBottomColor: "stroke.subtle",
    },
    "&:hover + &": {
      borderTopColor: "stroke.hover",
    },
    "&[data-highlighted] + &": {
      borderTopColor: "stroke.hover",
    },
    _hover: {
      borderBottomColor: "transparent",
      background: "surface.brand.1.subtle",
      borderTopColor: "stroke.hover",
      _last: {
        borderBottomColor: "stroke.hover",
      },
    },
    _highlighted: {
      background: "surface.brand.1.subtle",
      borderTopColor: "stroke.hover",
      _last: {
        borderBottomColor: "stroke.hover",
      },
    },
  },
});

const StyledButton = styled(Button, {
  base: {
    mobileWideDown: {
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

  const [runSearch, { loading, data: searchResult = {} }] = useLazyQuery<
    GQLGroupSearchQuery,
    GQLGroupSearchQueryVariables
  >(groupSearchQuery, { fetchPolicy: "no-cache" });

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

  const mappedResults = useMemo(() => {
    if (!query.length) return [];
    return (
      searchResult.groupSearch?.map((result) => {
        const contentType = contentTypeMapping[result.resourceType];
        return {
          ...result,
          resources: result.resources.map((resource) => ({
            ...resource,
            id: resource.id.toString(),
            resourceType: result.resourceType,
            contentType,
          })),
        };
      }) ?? []
    );
  }, [query.length, searchResult.groupSearch]);

  const mappedItems = useMemo(() => mappedResults.flatMap((result) => result.resources), [mappedResults]);

  const searchString = queryString.stringify({
    query: query && query.length > 0 ? query : undefined,
  });

  const onSearch = (evt?: FormEvent) => {
    evt?.preventDefault();

    setDialogState({ open: false });
    navigate({ pathname: "/search", search: `?${searchString}` });
  };

  return (
    <DialogRoot
      open={dialogState.open}
      variant="drawer"
      position="top"
      size="xsmall"
      onOpenChange={setDialogState}
      initialFocusEl={() => inputRef.current}
      lazyMount={false}
      unmountOnExit={false}
    >
      <DialogTrigger asChild>
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
            items={mappedItems}
            highlightedValue={highlightedValue}
            onHighlightChange={(details) => setHighligtedValue(details.highlightedValue)}
            inputValue={query}
            itemToValue={(item) => item.path}
            itemToString={(item) => item.name}
            onInputValueChange={(details) => onQueryChange(details.inputValue)}
            onInteractOutside={(e) => e.preventDefault()}
            positioning={{ strategy: "fixed" }}
            variant="simple"
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
                <ComboboxInput asChild>
                  <Input
                    ref={inputRef}
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
            {!!mappedItems.length || loading ? (
              <StyledComboboxContent>
                {loading ? (
                  <Spinner />
                ) : (
                  mappedItems.map((resource) => (
                    <StyledComboboxItem key={resource.id} item={resource} className="peer" asChild>
                      <SafeLink to={resource.path} onClick={onNavigate}>
                        <TextWrapper>
                          <ComboboxItemText>{resource.name}</ComboboxItemText>
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
                      </SafeLink>
                    </StyledComboboxItem>
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
