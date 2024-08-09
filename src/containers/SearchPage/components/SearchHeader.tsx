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
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Button, IconButton, Input, InputContainer, Text, Heading } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import SubjectFilter from "./SubjectFilter";
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

const StyledModalBody = styled(ModalBody, { base: { display: "flex", flexDirection: "column", alignItems: "center" } });

const StyledModalHeader = styled(ModalHeader, { base: { width: "100%" } });

const StyledSearchWrapper = styled("div", { base: { display: "flex", gap: "xsmall" } });

const StyledHitsWrapper = styled("div", { base: { marginTop: "xsmall" } });

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

  useEffect(() => {
    const onSlashPressed = (evt: KeyboardEvent) => {
      if (
        evt.key === "/" &&
        !["input", "textarea"].includes(document.activeElement?.tagName.toLowerCase() ?? "") &&
        document.activeElement?.attributes.getNamedItem("contenteditable")?.value !== "true"
      ) {
        evt.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onSlashPressed);
    return () => window.removeEventListener("keydown", onSlashPressed);
  }, []);

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
      {!isLti && <Heading>{t("searchPage.title")}</Heading>}
      <div>
        <form action="/search/" onSubmit={handleSearchSubmit}>
          <StyledSearchWrapper>
            <InputContainer>
              <Input
                ref={inputRef}
                type="search"
                autoComplete="off"
                id="search"
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
                  {/* TODO: Check if we should include an option for link variant to remove all padding */}
                  <Button variant="link" onClick={() => handleSearchParamsChange({ query: suggestion })}>
                    [{suggestion}]
                  </Button>
                </Text>
              )}
            </div>
          )}
        </StyledHitsWrapper>
      </div>
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <FiltersWrapper>
          <ModalTrigger>
            <Button variant="secondary">
              {t("searchPage.searchFilterMessages.noValuesButtonText")}
              <AddLine />
            </Button>
          </ModalTrigger>
          {/* TODO: Should these be pills? */}
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
        <ModalContent size="full">
          <StyledModalBody>
            <StyledModalHeader>
              <ModalTitle>{t("searchPage.searchFilterMessages.filterLabel")}</ModalTitle>
              <ModalCloseButton />
            </StyledModalHeader>
            <SubjectFilter
              categories={localeSubjectCategories}
              onToggleSubject={onToggleSubject}
              selectedSubjects={subjectIds}
            />
          </StyledModalBody>
        </ModalContent>
      </Modal>
      {!!grepElements.length && (
        <FiltersWrapper>
          {/* TODO: Probably needs special handling */}
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
