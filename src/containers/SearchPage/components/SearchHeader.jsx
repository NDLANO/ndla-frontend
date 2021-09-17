/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useMemo } from 'react';
import { func, string, arrayOf, bool } from 'prop-types';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { useTranslation } from 'react-i18next';
import { subjectsCategories, getSubjectLongName } from '../../../data/subjects';

const getSubjectCategoriesForLocale = locale => {
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

const SearchHeader = ({
  query,
  suggestion,
  subjects,
  handleSearchParamsChange,
  noResults,
  locale,
  grepCodes,
}) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState(query);
  const [activeFilters, setActiveFilters] = useState([]);

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
        name: longName,
        title: longName,
      };
    });
    const activeGrepCodes = grepCodes.map(id => ({
      value: id,
      name: id,
      title: id,
    }));
    setActiveFilters([...activeSubjects, ...activeGrepCodes]);
  }, [subjects, locale, grepCodes]);

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
    onFilterValueChange(
      grepCodes.filter(id => id !== value),
      subjects.filter(id => id !== value),
    );
    setActiveFilters(activeFilters.filter(id => id !== value));
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
        filters: activeFilters,
        onFilterRemove: handleFilterRemove,
      }}
      filters={subjectFilterProps}
      noResults={noResults}
    />
  );
};

SearchHeader.propTypes = {
  handleSearchParamsChange: func,
  handleNewSearch: func,
  query: string,
  suggestion: string,
  subjects: arrayOf(string),
  grepCodes: arrayOf(string),
  noResults: bool,
  locale: string,
};

export default SearchHeader;
