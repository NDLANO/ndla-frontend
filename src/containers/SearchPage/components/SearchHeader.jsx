/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { func, string, arrayOf } from 'prop-types';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { injectT } from '@ndla/i18n';
import { subjectsCategories, getSubjectById } from '../../../data/subjects';

const getSubjectCategoriesForLocale = locale => {
  return subjectsCategories.map(category => ({
    name: category.name[locale],
    subjects: category.subjects.map(subject => ({
      id: subject.id,
      name: subject.longName[locale],
    })),
  }));
};

const getSubjectFilterByFilter = filters => {
  return subjectsCategories
    .map(category =>
      category.subjects
        .filter(subject => filters.includes(subject.filters[0]))
        .map(s => s.id),
    )
    .flat();
};

// Revert f0c48049bd0f336b9154a13c64f8cf90fa5e4f67 for programme filter

const SearchHeader = ({
  t,
  query,
  suggestion,
  filters,
  handleSearchParamsChange,
  handleNewSearch,
  locale,
}) => {
  const [searchValue, setSearchValue] = useState(query);
  const [subjectFilter, setSubjectFilter] = useState([]);
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectCategoriesForLocale(locale),
    [locale],
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const subjectFilterUpdate = getSubjectFilterByFilter(filters);
    setSubjectFilter(subjectFilterUpdate);
    const activeSubjects = subjectFilterUpdate.map(id => {
      const subject = getSubjectById(id);
      return {
        value: id,
        name: subject.longName[locale],
        title: subject.longName[locale],
      };
    });
    setActiveSubjectFilters(activeSubjects);
  }, [filters, locale]);

  const onSubjectValuesChange = values => {
    const subjects = [];
    const filters = [];
    values.forEach(id => {
      const { subjectId, filters: subjectFilters } = getSubjectById(id);
      subjects.push(subjectId);
      filters.push(subjectFilters[0]);
    });
    handleNewSearch();
    handleSearchParamsChange({
      subjects,
      filters,
      levels: [],
    });
  };

  const subjectFilterProps = {
    subjectCategories: {
      categories: localeSubjectCategories,
      values: subjectFilter,
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
    handleNewSearch();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = value => {
    if (subjectFilter.includes(value)) {
      onSubjectValuesChange(subjectFilter.filter(id => id !== value));
    }
  };

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
        filters: activeSubjectFilters,
        onFilterRemove: handleFilterRemove,
      }}
      filters={subjectFilterProps}
    />
  );
};

SearchHeader.propTypes = {
  handleSearchParamsChange: func,
  handleNewSearch: func,
  query: string,
  suggestion: string,
  filters: arrayOf(string),
  locale: string,
};

export default injectT(SearchHeader);
