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
import { subjectsCategories } from '../../../data/subjects';

const getSubjectCategoriesForLocale = locale => {
  return subjectsCategories.map(category => ({
    name: category.name[locale],
    subjects: category.subjects.map(subject => ({
      id: `${subject.subjectId},${subject.filters[0]}`,
      name: subject.longName[locale],
    })),
  }));
};

const getSubjectFilterByFilter = filters => {
  return subjectsCategories
    .map(category =>
      category.subjects
        .filter(subject => filters.includes(subject.filters[0]))
        .map(s => `${s.subjectId},${s.filters[0]}`),
    )
    .flat();
};

const SearchHeader = ({
  t,
  query,
  suggestion,
  filters,
  handleSearchParamsChange,
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
    setSubjectFilter(getSubjectFilterByFilter(filters));
  }, [filters]);

  useEffect(() => {
    const newActiveSubjectFilters = [];
    localeSubjectCategories.forEach(category => {
      category.subjects.forEach(subject => {
        if (subjectFilter.includes(subject.id)) {
          newActiveSubjectFilters.push({
            name: subject.name,
            value: subject.id,
            title: subject.name,
          });
        }
      });
    });
    setActiveSubjectFilters(newActiveSubjectFilters);
  }, [subjectFilter, localeSubjectCategories]);

  const handleSubjectValuesChange = values => {
    setSubjectFilter(values);
    const subjects = [];
    const filters = [];
    values.forEach(id => {
      const [subject, filter] = id.split(',');
      if (!subjects.includes(subject)) subjects.push(subject);
      if (!filters.includes(filter)) filters.push(filter);
    });
    handleSearchParamsChange({
      subjects,
      filters,
    });
  };

  const subjectFilterProps = {
    subjectCategories: {
      categories: localeSubjectCategories,
      values: subjectFilter,
      onSubjectValuesChange: handleSubjectValuesChange,
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
    handleSubjectValuesChange(subjectFilter.filter(id => id !== value));
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
  query: string,
  suggestion: string,
  filters: arrayOf(string),
  locale: string,
};

export default injectT(SearchHeader);
