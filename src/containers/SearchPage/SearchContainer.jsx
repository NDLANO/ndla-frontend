/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { func, arrayOf, objectOf, object, string, shape } from 'prop-types';
import {
  SearchHeader,
  SearchSubjectResult,
  SearchNotionsResult,
} from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import {
  SearchItemShape,
  ConceptShape,
  TypeFilterShape,
  SearchGroupShape,
} from '../../shapes';
import SearchResults from './components/SearchResults';
import { filterTypeOptions } from './searchHelpers';

const sortedResourceTypes = [
  'topic-article',
  'subject-material',
  'learning-path',
  'tasks-and-activities',
  'assessment-resources',
  'external-learning-resources',
  'source-material',
];

const SearchContainer = ({
  t,
  handleSearchParamsChange,
  handleFilterClick,
  handleShowMore,
  handleSetSubjectType,
  query,
  subjects,
  allSubjects,
  subjectItems,
  concepts,
  suggestion,
  currentSubjectType,
  typeFilter,
  searchGroups,
}) => {
  const [searchValue, setSearchValue] = useState(query);
  const [showConcepts, setShowConcepts] = useState(true);

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
    <>
      <SearchHeader
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
      {showConcepts && concepts?.length ? (
        <SearchNotionsResult
          items={concepts}
          totalCount={concepts.length}
          onRemove={() => {
            setShowConcepts(false);
          }}
        />
      ) : null}
      {subjectItems?.length ? (
        <SearchSubjectResult items={subjectItems} />
      ) : null}
      <FilterTabs
        dropdownBtnLabel="Velg"
        value={currentSubjectType ? currentSubjectType : 'ALL'}
        options={filterTypeOptions(searchGroups, t)}
        contentId="search-result-content"
        onChange={handleSetSubjectType}>
        <SearchResults
          searchGroups={searchGroups.sort(
            (a, b) =>
              sortedResourceTypes.indexOf(a.type) -
              sortedResourceTypes.indexOf(b.type),
          )}
          currentSubjectType={currentSubjectType}
          typeFilter={typeFilter}
          handleFilterClick={handleFilterClick}
          handleShowMore={handleShowMore}
        />
      </FilterTabs>
    </>
  );
};

SearchContainer.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
  handleFilterClick: func,
  handleShowMore: func,
  handleSetSubjectType: func,
  query: string,
  subjects: arrayOf(string),
  allSubjects: arrayOf(
    shape({
      title: string,
      value: string,
    }),
  ),
  subjectItems: arrayOf(SearchItemShape),
  concepts: arrayOf(ConceptShape),
  suggestion: string,
  currentSubjectType: string,
  typeFilter: objectOf(TypeFilterShape),
  searchGroups: arrayOf(SearchGroupShape),
};

export default injectT(SearchContainer);
