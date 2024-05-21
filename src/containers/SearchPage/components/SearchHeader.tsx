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
import { ButtonV2, IconButtonV2 } from "@ndla/button";
import { breakpoints, mq, spacing } from "@ndla/core";
import { InputContainer, InputV3 } from "@ndla/forms";
import { Cross, Plus } from "@ndla/icons/action";
import { Search } from "@ndla/icons/common";
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalTitle, ModalTrigger } from "@ndla/modal";
import { Text } from "@ndla/typography";
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
  gap: ${spacing.small};
  margin-top: ${spacing.normal};
  ${mq.range({ from: breakpoints.tablet })} {
    margin-top: ${spacing.large};
  }
`;

const StyledInputContainer = styled(InputContainer)`
  background: transparent;
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
  max-width: 1040px;
  padding: 0px;
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
      <form action="/search/" onSubmit={handleSearchSubmit}>
        <StyledInputContainer>
          <InputV3
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
            <IconButtonV2
              variant="ghost"
              colorTheme="greyLighter"
              aria-label={t("welcomePage.resetSearch")}
              value={t("welcomePage.resetSearch")}
              onClick={() => {
                onSearchValueChange("");
                inputRef.current?.focus();
              }}
            >
              <Cross />
            </IconButtonV2>
          )}
          <IconButtonV2
            variant="ghost"
            colorTheme="light"
            type="submit"
            aria-label={t("searchPage.search")}
            title={t("searchPage.search")}
          >
            <Search />
          </IconButtonV2>
        </StyledInputContainer>
      </form>
      <div aria-live="assertive">
        {!loading && query && (
          <div>
            {noResults ? (
              <Text textStyle="meta-text-medium" margin="none">
                {t("searchPage.noHitsShort", { query: query })}
                {activeSubjectFilters.length ? `. ${t("searchPage.removeFilterSuggestion")}` : undefined}
              </Text>
            ) : (
              <Text textStyle="meta-text-medium" margin="none">
                {t("searchPage.resultType.showingSearchPhrase")} <b>&ldquo;{query}&rdquo;</b>
              </Text>
            )}
            {suggestion && (
              <Text textStyle="meta-text-medium" margin="none">
                {t("searchPage.resultType.searchPhraseSuggestion")}{" "}
                <ButtonV2 variant="link" onClick={() => handleSearchParamsChange({ query: suggestion })}>
                  [{suggestion}]
                </ButtonV2>
              </Text>
            )}
          </div>
        )}
        {loading && <div aria-label={t("loading")} />}
      </div>
      {!!grepElements.length && (
        <FiltersWrapper>
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
            <ButtonV2 colorTheme="greyLighter" shape="pill">
              {t("searchPage.searchFilterMessages.noValuesButtonText")}
              <Plus />
            </ButtonV2>
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
