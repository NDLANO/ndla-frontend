/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { subjectsCategories, getSubjectLongName } from '../../../data/subjects';
import { groupCompetenceGoals } from '../../../components/CompetenceGoals';
import { SearchCompetenceGoal } from '../SearchInnerPage';
import { LocaleType } from '../../../interfaces';

const getSubjectCategoriesForLocale = (locale: LocaleType) => {
  return subjectsCategories.map(category => ({
    name: category.name[locale],
    visible: category.visible,
    subjects: category.subjects.map(subject => ({
      id: subject.id,
      name: subject.longName[locale],
    })),
  }));
};

// Revert f0c48049bd0f336b9154a13c64f8cf90fa5e4f67 + d39a0c692bbd0e3151fa13a7ec28b0cf229d9fd1 for programme filter

interface Props {
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  query?: string;
  suggestion?: string;
  subjects: string[];
  competenceGoals: SearchCompetenceGoal[];
  noResults: boolean;
  locale: LocaleType;
}

interface ActiveFilter {
  value: string;
  name: string;
  title: string;
}
const SearchHeader = ({
  query,
  suggestion,
  subjects,
  handleSearchParamsChange,
  noResults,
  locale,
  competenceGoals,
}: Props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(query);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectCategoriesForLocale(locale),
    [locale],
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const activeSubjects = subjects.map(id => {
      const longName = getSubjectLongName(id, locale);
      return {
        value: id,
        name: longName ?? '',
        title: longName ?? '',
      };
    });
    const activeGrepCodes = competenceGoals.map(e => ({
      value: e.id,
      name: e.id,
      title: e.id,
    }));
    setActiveFilters([...activeSubjects, ...activeGrepCodes]);
  }, [subjects, locale, competenceGoals]);

  const onSubjectValuesChange = (values: string[]) => {
    handleSearchParamsChange({
      subjects: values,
    });
  };

  const onFilterValueChange = (
    grepCodeFilters: string[],
    subjectFilters: string[],
  ) => {
    handleSearchParamsChange({
      grepCodes: grepCodeFilters,
      subjects: subjectFilters,
    });
  };

  const subjectFilterProps = {
    subjectCategories: {
      categories: localeSubjectCategories,
      values: subjects,
      onSubjectValuesChange: onSubjectValuesChange,
    },
    messages: {
      filterLabel: t('searchPage.searchFilterMessages.filterLabel'),
      closeButton: t('searchPage.close'),
      buttonText: t('searchPage.searchFilterMessages.noValuesButtonText'),
    },
  };

  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = (value: string) => {
    onFilterValueChange(
      competenceGoals.filter(e => e.id !== value).map(e => e.id),
      subjects.filter(id => id !== value),
    );
    setActiveFilters(activeFilters.filter(filter => filter.value !== value));
  };

  const onSearchValueChange = (value: string) => {
    if (value === '' && (searchValue ?? '').length > 2) {
      handleSearchParamsChange({ query: '' });
    }
    setSearchValue(value);
  };

  const competenceGoalsMetadata = groupCompetenceGoals(
    competenceGoals,
    false,
    'LK06',
  )?.flatMap(e => e.elements);

  return (
    <SearchHeaderUI
      searchPhrase={query}
      searchPhraseSuggestion={suggestion}
      searchPhraseSuggestionOnClick={() =>
        handleSearchParamsChange({ query: suggestion })
      }
      searchValue={searchValue}
      onSearchValueChange={value => onSearchValueChange(value)}
      onSubmit={handleSearchSubmit}
      activeFilters={{
        filters: activeFilters,
        onFilterRemove: handleFilterRemove,
      }}
      filters={subjectFilterProps}
      noResults={noResults}
      competenceGoals={competenceGoalsMetadata}
    />
  );
};

export default SearchHeader;
