/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
import { SearchHeader as SearchHeaderUI } from '@ndla/ui';
import { injectT } from '@ndla/i18n';

const SearchHeader = ({
  t,
  query,
  suggestion,
  subjects,
  allSubjects,
  handleSearchParamsChange,
}) => {
  const [searchValue, setSearchValue] = useState(query);

  const filterProps = {
    options: allSubjects,
    values: subjects,
    onSubmit: filters => {
      handleSearchParamsChange({ subjects: filters });
    },
    messages: {
      filterLabel: t('searchPage.searchFilterMessages.filterLabel'),
      closeButton: t('searchPage.close'),
      confirmButton: t('searchPage.searchFilterMessages.confirmButton'),
      buttonText: t('searchPage.searchFilterMessages.noValuesButtonText'),
    },
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    handleSearchParamsChange({ query: searchValue });
  };

  const handleFilterRemove = value => {
    handleSearchParamsChange({
      subjects: subjects.filter(option => option !== value),
    });
  };

  const activeSubjectFilters = allSubjects.filter(option =>
    subjects.includes(option.value),
  );

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
      filters={filterProps}
    />
  );
};

SearchHeader.propTypes = {
  handleSearchParamsChange: func,
  query: string,
  subjects: arrayOf(string),
  allSubjects: arrayOf(
    shape({
      title: string,
      value: string,
    }),
  ),
  suggestion: string,
};

export default injectT(SearchHeader);
