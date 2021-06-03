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
import {
  subjectsCategories,
  getSubjectBySubjectIdFilters,
} from '../../../data/subjects';

const getSubjectCategoriesForLocale = locale => {
  return subjectsCategories.map(category => ({
    name: category.name[locale],
    subjects: category.subjects.map(subject => ({
      id: subject.subjectId,
      name: subject.longName[locale],
    })),
  }));
};

// Revert f0c48049bd0f336b9154a13c64f8cf90fa5e4f67 + d39a0c692bbd0e3151fa13a7ec28b0cf229d9fd1 for programme filter

const SearchHeader = ({
  t,
  query,
  suggestion,
  subjects,
  handleSearchParamsChange,
  locale,
}) => {
  const [searchValue, setSearchValue] = useState(query);
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);

  const localeSubjectCategories = useMemo(
    () => getSubjectCategoriesForLocale(locale),
    [locale],
  );

  useEffect(() => {
    setSearchValue(query);
  }, [query]);

  useEffect(() => {
    const activeSubjects = subjects.map(id => {
      const subject = getSubjectBySubjectIdFilters(id);
      return {
        value: id,
        name: subject.longName[locale],
        title: subject.longName[locale],
      };
    });
    setActiveSubjectFilters(activeSubjects);
  }, [subjects, locale]);

  const onSubjectValuesChange = values => {
    handleSearchParamsChange({
      subjects: values,
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

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = value => {
    onSubjectValuesChange(subjects.filter(id => id !== value));
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
  subjects: arrayOf(string),
  locale: string,
};

export default injectT(SearchHeader);
