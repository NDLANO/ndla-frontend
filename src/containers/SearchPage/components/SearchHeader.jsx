/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { func, string } from 'prop-types';
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

let activeSubjectFilters = [];

const SearchHeader = ({
  t,
  query,
  suggestion,
  handleSearchParamsChange,
  locale,
}) => {
  const [searchValue, setSearchValue] = useState(query);
  const [subjectFilter, setSubjectFilter] = useState([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectCategoriesForLocale(locale),
    [locale],
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    activeSubjectFilters = [];
    localeSubjectCategories.forEach(category => {
      category.subjects.forEach(subject => {
        if (subjectFilter.includes(subject.id)) {
          activeSubjectFilters.push({
            name: subject.name,
            value: subject.id,
            title: subject.name,
          });
        }
      });
    });
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
  locale: string,
};

export default injectT(SearchHeader);
