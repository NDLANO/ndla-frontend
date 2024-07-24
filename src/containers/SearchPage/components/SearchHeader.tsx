/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useMemo, FormEvent, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2 } from "@ndla/button";
import { breakpoints, mq, spacing } from "@ndla/core";
import { Cross, Plus } from "@ndla/icons/action";
import { Search } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Button, IconButton, Input, InputContainer, Text, Heading } from "@ndla/primitives";
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
}

const MAX_SHOW_SUBJECT_FILTERS = 2;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
  margin-top: ${spacing.normal};
  ${mq.range({ from: breakpoints.tablet })} {
    margin-top: ${spacing.large};
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  flex-wrap: wrap;
`;

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledModalHeader = styled(ModalHeader)`
  width: 100%;
`;

const StyledSearchWrapper = styled.div`
  display: flex;
  gap: ${spacing.xsmall};
`;

const StyledHitsWrapper = styled.div`
  margin-top: ${spacing.xsmall};
`;

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
      <Heading>{t("searchPage.title")}</Heading>
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
                  <Cross />
                </IconButton>
              )}
            </InputContainer>
            <IconButton
              variant="primary"
              type="submit"
              aria-label={t("searchPage.search")}
              title={t("searchPage.search")}
            >
              <Search />
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
          {loading && <div aria-label={t("loading")} />}
        </StyledHitsWrapper>
      </div>
      {!!grepElements.length && (
        <FiltersWrapper>
          {/* TODO: Probably needs special handling */}
          {grepElements.map((grep) => (
            <ButtonV2 key={grep.id} shape="pill" onClick={() => onGrepRemove(grep.id)}>
              {grep.id}
              <Cross />
            </ButtonV2>
          ))}
        </FiltersWrapper>
      )}
      <Modal open={isOpen} onOpenChange={setIsOpen}>
        <FiltersWrapper>
          <ModalTrigger>
            <Button variant="secondary">
              {t("searchPage.searchFilterMessages.noValuesButtonText")}
              <Plus />
            </Button>
          </ModalTrigger>
          {activeSubjectFilters.slice(0, MAX_SHOW_SUBJECT_FILTERS).map((subject) => (
            <ButtonV2 key={subject.id} shape="pill" onClick={() => onToggleSubject(subject.id)}>
              {subject.name}
              <Cross />
            </ButtonV2>
          ))}
          {activeSubjectFilters.length > MAX_SHOW_SUBJECT_FILTERS && (
            <ButtonV2 shape="pill" onClick={() => setIsOpen(true)}>
              {t("searchPage.searchFilterMessages.additionalSubjectFilters", {
                count: activeSubjectFilters.length - MAX_SHOW_SUBJECT_FILTERS,
              })}
            </ButtonV2>
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
    </Wrapper>
  );
};

export default SearchHeader;
