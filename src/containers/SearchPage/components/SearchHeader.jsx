/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { func, string, arrayOf, bool, object } from 'prop-types';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { SubjectShape } from '../../../shapes';
import { getSubjectsCategories } from '../../../data/subjects';
import { groupCompetenceGoals } from '../../../components/CompetenceGoals';

const SearchHeader = ({
  query,
  suggestion,
  subjectIds,
  handleSearchParamsChange,
  subjects,
  noResults,
  locale,
  competenceGoals,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(query);
  const [activeFilters, setActiveFilters] = useState([]);

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

  const onSubjectValuesChange = values => {
    handleSearchParamsChange({
      subjects: values,
    });
  };

  const onFilterValueChange = (grepCodeFilters, subjectFilters) => {
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

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = value => {
    onFilterValueChange(
      competenceGoals.filter(e => e.id !== value).map(e => e.id),
      subjectIds.filter(id => id !== value),
    );
    setActiveFilters(activeFilters.filter(id => id !== value));
  };

  const competenceGoalsMetadata = groupCompetenceGoals(
    competenceGoals,
    false,
    'LK06',
  ).flatMap(e => e.elements);

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

SearchHeader.propTypes = {
  handleSearchParamsChange: func,
  handleNewSearch: func,
  query: string,
  suggestion: string,
  competenceGoals: arrayOf(object),
  subjectIds: arrayOf(string),
  subjects: arrayOf(SubjectShape),
  noResults: bool,
  locale: string,
};

export default SearchHeader;
