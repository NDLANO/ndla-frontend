/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo, FormEvent } from 'react';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { SubjectShape } from '../../../shapes';
import { getSubjectsCategories } from '../../../data/subjects';
import { groupCompetenceGoals } from '../../../components/CompetenceGoals';
import { SearchCompetenceGoal } from '../SearchInnerPage';
import { LocaleType } from '../../../interfaces';

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
  subjectIds,
  handleSearchParamsChange,
  subjects,
  noResults,
  locale,
  competenceGoals,
}: Props) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(query);
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectsCategories(subjects),
    [subjects],
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const activeSubjects = subjectIds.map(id => {
      const name = subjects.find(subject => subject.id === id).name;
      return {
        value: id,
        name: name,
        title: name,
      };
    });
    const activeGrepCodes = competenceGoals.map(e => ({
      value: e.id,
      name: e.id,
      title: e.id,
    }));
    setActiveFilters([...activeSubjects, ...activeGrepCodes]);
  }, [subjects, subjectIds, locale, competenceGoals]);

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
      values: subjectIds,
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
      subjectIds.filter(id => id !== value),
    );
    setActiveFilters(activeFilters.filter(filter => filter.value !== value));
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
      onSearchValueChange={value => setSearchValue(value)}
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
