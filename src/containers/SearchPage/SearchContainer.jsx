/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React from 'react';
import { func, arrayOf, objectOf, shape, object, string } from 'prop-types';
import { SearchHeader, constants } from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import { SearchGroupShape, TypeFilterShape } from '../../shapes';
import SearchResults from './components/SearchResults';
import { searchSubjectTypeOptions, getTypeFilter } from './searchHelpers';
import { resourceTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';

const { contentTypes } = constants;

const SearchContainer = ({
  error,
  history,
  query,
  setParams,
  currentSubjectType,
  setCurrentSubjectType,
  typeFilter,
  setTypeFilter,
  searchGroups,
  setSearchGroups,
  suggestion,
}) => {
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
        resourceTypes: null,
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
        resourceTypes: filters
          .filter(filter => filter.active)
          .map(f => f.id)
          .join(),
      }));
    }
  };

  const handleSetSubjectType = type => {
    if (type === 'ALL') {
      setCurrentSubjectType(null);
      setTypeFilter(getTypeFilter);
      setParams({
        page: 1,
        pageSize: 4,
        resourceTypes: null,
      });
    } else if (type === contentTypes.SUBJECT) {
      updateTypeFilter(
        type,
        1,
        searchGroups.find(group => group.type === type).totalCount,
      );
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
          resourceTypes: hasActiveFilters(type)
            ? prevState.resourceTypes
            : resourceTypeMapping[type],
        }));
      }
    }
  };

  const handleShowMore = type => {
    const pageIncrement = type === contentTypes.SUBJECT ? 2 : 4;
    updateTypeFilter(type, 1, typeFilter[type].pageSize + pageIncrement);
    if (type !== contentTypes.SUBJECT) {
      setLoadingOnGroup(type);
      setParams(prevState => ({
        ...prevState,
        pageSize: prevState.pageSize + pageIncrement,
        resourceTypes: hasActiveFilters(type)
          ? prevState.resourceTypes
          : resourceTypeMapping[type],
      }));
    }
  };

  const handleShowAll = type => {
    handleSetSubjectType(type);
  };

  const onPagerNavigate = pagerEvent => {
    const { type, page } = pagerEvent;
    updateTypeFilter(type, page, 8);
    if (type !== contentTypes.SUBJECT) {
      setLoadingOnGroup(type);
      setParams(prevState => ({
        page,
        pageSize: 8,
        resourceTypes: hasActiveFilters(type)
          ? prevState.resourceTypes
          : resourceTypeMapping[type],
      }));
    }
  };

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  return (
    <>
      <SearchHeader
        count={searchGroups.reduce((acc, item) => acc + item.totalCount, 0)}
        searchPhrase={query}
        searchPhraseSuggestion={suggestion}
        searchPhraseSuggestionOnClick={() => {
          history.push({
            search: `?query=${suggestion}`,
          });
        }}
      />
      <SearchResults
        searchGroups={searchGroups.filter(
          item => item.type === contentTypes.SUBJECT,
        )}
        currentSubjectType={currentSubjectType}
        typeFilter={typeFilter}
        handleFilterClick={handleFilterClick}
        handleShowMore={handleShowMore}
        handleShowAll={handleShowAll}
        onPagerNavigate={onPagerNavigate}
      />
      <FilterTabs
        dropdownBtnLabel="Velg"
        value={currentSubjectType ? currentSubjectType : 'ALL'}
        options={searchSubjectTypeOptions}
        contentId="search-result-content"
        onChange={handleSetSubjectType}>
        <SearchResults
          searchGroups={searchGroups.filter(
            item => item.type !== contentTypes.SUBJECT,
          )}
          currentSubjectType={currentSubjectType}
          typeFilter={typeFilter}
          handleFilterClick={handleFilterClick}
          handleShowMore={handleShowMore}
          handleShowAll={handleShowAll}
          onPagerNavigate={onPagerNavigate}
        />
      </FilterTabs>
    </>
  );
};

SearchContainer.propTypes = {
  error: arrayOf(object),
  history: shape({
    push: func.isRequired,
  }).isRequired,
  query: string,
  suggestion: string,
  currentSubjectType: string,
  setCurrentSubjectType: func,
  searchGroups: arrayOf(SearchGroupShape),
  setSearchGroups: func,
  typeFilter: objectOf(TypeFilterShape),
  setTypeFilter: func,
  setParams: func,
};

export default injectT(SearchContainer);
