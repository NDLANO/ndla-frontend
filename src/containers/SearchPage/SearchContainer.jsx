/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { func, arrayOf, objectOf, object, string } from 'prop-types';
import { SearchHeader, SearchSubjectResult } from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import {
  SearchGroupShape,
  SearchItemShape,
  TypeFilterShape,
} from '../../shapes';
import SearchResults from './components/SearchResults';
import { getTypeFilter, filterTypeOptions } from './searchHelpers';
import { resourceTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';

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
  error,
  query,
  search,
  suggestion,
  subjectItems,
  setParams,
  currentSubjectType,
  setCurrentSubjectType,
  typeFilter,
  setTypeFilter,
  searchGroups,
  setSearchGroups,
}) => {
  const [searchValue, setSearchValue] = useState(query);

  const setLoadingOnGroup = type => {
    setSearchGroups(prevState =>
      prevState.map(group => ({
        ...group,
        loading: group.type === type,
      })),
    );
  };

  const hasActiveFilters = type =>
    typeFilter[type].filters.length &&
    !typeFilter[type].filters.find(f => f.id === 'all').active;

  const updateTypeFilter = (type, page, pageSize) => {
    const filterUpdate = { ...typeFilter };
    filterUpdate[type] = {
      ...filterUpdate[type],
      page,
      pageSize,
    };
    setTypeFilter(filterUpdate);
  };

  const handleFilterClick = (type, filterId) => {
    const filters = typeFilter[type].filters;
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
      setParams(prevState => ({
        ...prevState,
        types: null,
      }));
    } else {
      const allFilter = filters.find(item => 'all' === item.id);
      allFilter.active = false;
      selectedFilter.active = !selectedFilter.active;
      if (!filters.some(item => item.active)) {
        allFilter.active = true;
      }
      setParams(prevState => ({
        ...prevState,
        types: filters
          .filter(filter => filter.active)
          .map(f => f.id)
          .join(),
      }));
    }
  };

  const handleSetSubjectType = type => {
    if (type === 'ALL') {
      setCurrentSubjectType(null);
      setTypeFilter(getTypeFilter());
      setParams({
        page: 1,
        pageSize: 4,
        types: null,
      });
    } else {
      setCurrentSubjectType(type);
      if (typeFilter[type]) {
        updateTypeFilter(type, 1, 8);
        if (type !== currentSubjectType) {
          setLoadingOnGroup(type);
        }
        setParams(prevState => ({
          page: 1,
          pageSize: 8,
          types: hasActiveFilters(type)
            ? prevState.types
            : resourceTypeMapping[type] || type,
        }));
      }
    }
  };

  const handleShowMore = type => {
    const pageSize = typeFilter[type].pageSize + 4;
    updateTypeFilter(type, 1, pageSize);
    setLoadingOnGroup(type);
    setParams(prevState => ({
      ...prevState,
      pageSize: pageSize,
      types: hasActiveFilters(type)
        ? prevState.types
        : resourceTypeMapping[type] || type,
    }));
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    search(searchValue);
  };

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  return (
    <>
      <SearchHeader
        searchPhrase={query}
        searchPhraseSuggestion={suggestion}
        searchPhraseSuggestionOnClick={() => search(suggestion)}
        searchValue={searchValue}
        onSearchValueChange={value => setSearchValue(value)}
        onSubmit={handleSearchSubmit}
      />
      <SearchSubjectResult items={subjectItems} />
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
  query: string,
  search: func,
  suggestion: string,
  subjectItems: arrayOf(SearchItemShape),
  currentSubjectType: string,
  setCurrentSubjectType: func,
  searchGroups: arrayOf(SearchGroupShape),
  setSearchGroups: func,
  typeFilter: objectOf(TypeFilterShape),
  setTypeFilter: func,
  setParams: func,
};

export default injectT(SearchContainer);
