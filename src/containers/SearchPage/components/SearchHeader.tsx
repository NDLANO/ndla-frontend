/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo, FormEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import { CloseLine, AddLine } from "@ndla/icons/action";
import { SearchLine } from "@ndla/icons/common";
import {
  Button,
  IconButton,
  InputContainer,
  Text,
  Heading,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogBody,
  DialogHeader,
  DialogTitle,
  FieldRoot,
  FieldLabel,
  FieldInput,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SubjectFilter from "./SubjectFilter";
import { DialogCloseButton } from "../../../components/DialogCloseButton";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import { GQLCompetenceGoal, GQLCoreElement, GQLSubjectInfoFragment } from "../../../graphqlTypes";
import { getSubjectsCategories } from "../../../util/subjects";

interface Props {
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  query?: string;
  suggestion?: string;
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
  competenceGoals: GQLCompetenceGoal[];
  coreElements: GQLCoreElement[];
  noResults: boolean;
  loading: boolean;
  isLti?: boolean;
}

const MAX_SHOW_SUBJECT_FILTERS = 2;

const Wrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const FiltersWrapper = styled("div", { base: { display: "flex", gap: "small", flexWrap: "wrap" } });

const StyledSearchWrapper = styled("div", { base: { display: "flex", gap: "xsmall" } });

const StyledHitsWrapper = styled("div", { base: { marginTop: "xsmall" } });

const StyledFieldRoot = styled(FieldRoot, {
  base: {
    width: "100%",
  },
});

const SearchHeader = ({
  query,
  suggestion,
  subjectIds,
  handleSearchParamsChange,
  subjects,
  noResults,
  competenceGoals,
  coreElements,
  loading,
  isLti,
}: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState(query ?? "");
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSubjectFilters = useMemo(() => {
    return subjects?.filter((subject) => subjectIds.includes(subject.id)) ?? [];
  }, [subjectIds, subjects]);

  const localeSubjectCategories = useMemo(() => getSubjectsCategories(t, subjects), [t, subjects]);

  const grepElements = useMemo(() => [...competenceGoals, ...coreElements], [competenceGoals, coreElements]);

  useEffect(() => {
    setSearchValue(query ?? "");
  }, [query]);

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchParamsChange({ query: searchValue });
  };

  const onToggleSubject = (subjectId: string) => {
    if (subjectIds.includes(subjectId)) {
      handleSearchParamsChange({ subjects: subjectIds.filter((id) => id !== subjectId) });
    } else {
      handleSearchParamsChange({ subjects: subjectIds.concat(subjectId) });
    }
  };

  const onGrepRemove = (grepValue: string) => {
    handleSearchParamsChange({
      grepCodes: grepElements.filter((grep) => grep.id !== grepValue).map((grep) => grep.id),
    });
  };

  const onSearchValueChange = (value: string) => {
    if (value === "" && (searchValue ?? "").length > 2) {
      handleSearchParamsChange({ query: "" });
    }
    setSearchValue(value);
  };

  return (
    <Wrapper>
      {!isLti && (
        <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
          {t("searchPage.title")}
        </Heading>
      )}
      <div>
        <form action="/search/" onSubmit={handleSearchSubmit}>
          <StyledSearchWrapper>
            <StyledFieldRoot>
              <FieldLabel srOnly>{t("searchPage.title")}</FieldLabel>
              <InputContainer>
                <FieldInput
                  ref={inputRef}
                  type="search"
                  autoComplete="off"
                  name="search"
                  placeholder={t("searchPage.searchFieldPlaceholder")}
                  value={searchValue}
                  onChange={(e) => onSearchValueChange(e.target.value)}
                />
                {searchValue && (
                  <IconButton
                    variant="clear"
                    aria-label={t("welcomePage.resetSearch")}
                    value={t("welcomePage.resetSearch")}
                    onClick={() => {
                      onSearchValueChange("");
                      inputRef.current?.focus();
                    }}
                  >
                    <CloseLine />
                  </IconButton>
                )}
              </InputContainer>
            </StyledFieldRoot>
            <IconButton
              variant="primary"
              type="submit"
              aria-label={t("searchPage.search")}
              title={t("searchPage.search")}
            >
              <SearchLine />
            </IconButton>
          </StyledSearchWrapper>
        </form>
        <StyledHitsWrapper aria-live="assertive">
          {!loading && query && (
            <div>
              {noResults ? (
                <Text textStyle="label.small">
                  {t("searchPage.noHitsShort", { query: query })}
                  {activeSubjectFilters.length ? `. ${t("searchPage.removeFilterSuggestion")}` : undefined}
                </Text>
              ) : (
                <Text textStyle="label.small">
                  {t("searchPage.resultType.showingSearchPhrase")} &ldquo;{query}&rdquo;
                </Text>
              )}
              {suggestion && (
                <Text textStyle="label.small">
                  {t("searchPage.resultType.searchPhraseSuggestion")}
                  <Button variant="link" onClick={() => handleSearchParamsChange({ query: suggestion })}>
                    [{suggestion}]
                  </Button>
                </Text>
              )}
            </div>
          )}
        </StyledHitsWrapper>
      </div>
      <DialogRoot size="full" open={isOpen} onOpenChange={(details) => setIsOpen(details.open)}>
        <FiltersWrapper>
          <DialogTrigger asChild>
            <Button variant="secondary">
              {t("searchPage.searchFilterMessages.noValuesButtonText")}
              <AddLine />
            </Button>
          </DialogTrigger>
          {activeSubjectFilters.slice(0, MAX_SHOW_SUBJECT_FILTERS).map((subject) => (
            <Button key={subject.id} size="small" variant="primary" onClick={() => onToggleSubject(subject.id)}>
              {subject.name}
              <CloseLine />
            </Button>
          ))}
          {activeSubjectFilters.length > MAX_SHOW_SUBJECT_FILTERS && (
            <Button variant="primary" size="small" onClick={() => setIsOpen(true)}>
              {t("searchPage.searchFilterMessages.additionalSubjectFilters", {
                count: activeSubjectFilters.length - MAX_SHOW_SUBJECT_FILTERS,
              })}
            </Button>
          )}
        </FiltersWrapper>
        <DialogContent>
          <DialogBody>
            <DialogHeader>
              <DialogTitle>{t("searchPage.searchFilterMessages.filterLabel")}</DialogTitle>
              <DialogCloseButton />
            </DialogHeader>
            <SubjectFilter
              categories={localeSubjectCategories}
              onToggleSubject={onToggleSubject}
              selectedSubjects={subjectIds}
            />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
      {!!grepElements.length && (
        <FiltersWrapper>
          {grepElements.map((grep) => (
            <Button key={grep.id} variant="primary" size="small" onClick={() => onGrepRemove(grep.id)}>
              {grep.id}
              <CloseLine />
            </Button>
          ))}
        </FiltersWrapper>
      )}
    </Wrapper>
  );
};

export default SearchHeader;
