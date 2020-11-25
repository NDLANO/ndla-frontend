/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
import {
  func,
  arrayOf,
  shape,
  object,
} from 'prop-types';
import { SearchHeader, constants } from '@ndla/ui';
import { FilterTabs } from '@ndla/tabs';
import { injectT } from '@ndla/i18n';

import {
  SearchParamsShape,
  SearchDataShape,
} from '../../shapes';
import SearchResults from './components/SearchResults';
import { getTypeFilter, getSearchGroups, updateSearchGroups, searchSubjectTypeOptions } from './searchHelpers';
import { resourceTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';

const { contentTypes } = constants;

const SearchContainer = ({
  error,
  history,
  searchData,
  searchParams,
  setParams,
}) => {
  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter(searchData));
  const [searchGroups, setSearchGroups] = useState(getSearchGroups(searchData));

  useEffect(() => {
    setSearchGroups(prevState =>
      updateSearchGroups(searchData, prevState)
    );
  }, [searchData]);

  const setLoadingOnGroup = type => {
    searchGroups.find(group => group.type === type).loading = true;
  }

  const hasActiveFilters = type => (
    typeFilter[type].filters.length && !typeFilter[type].filters.find(f => f.id === 'all').active
  )

  const handleFilterClick = (type, filterId) => {
    const filterUpdate = { ...typeFilter[type] };
    const filters = [...filterUpdate.filters];
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
      setParams(prevState => ({
        ...prevState,
        resourceTypes: null
      }))
    } else {
      const allFilter = filters.find(item => 'all' === item.id);
      allFilter.active = false;
      selectedFilter.active = !selectedFilter.active;
      if (!filters.some(item => item.active)) {
        allFilter.active = true;
      }
      setParams(prevState => ({
        ...prevState,
        resourceTypes: filters.filter(filter => filter.active).map(f => f.id).join()
      }))
    }
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
  };

  const handleSetSubjectType = type => {
    if (type === 'ALL') {
      setCurrentSubjectType(null);
      setParams({
        page: 1,
        pageSize: 4,
        resourceTypes: null
      })
    } 
    else if (type === contentTypes.SUBJECT) {
      const filterUpdate = { ...typeFilter };
        filterUpdate[type] = {
          ...filterUpdate[type],
          pageSize: searchGroups.find(group => group.type === type).totalCount,
          page: 1,
        };
        setTypeFilter(filterUpdate);
    }
    else {
      if (typeFilter[type]) {
        const filterUpdate = { ...typeFilter };
        filterUpdate[type] = {
          ...filterUpdate[type],
          pageSize: 8,
          page: 1,
        };
        setTypeFilter(filterUpdate);
        if (type !== currentSubjectType) {
          setLoadingOnGroup(type);
        }
        setParams({
          page: 1,
          pageSize: 8,
          resourceTypes: resourceTypeMapping[type]
        })
      }
      setCurrentSubjectType(type);
    }
  };

  const handleShowMore = type => {
    const filterUpdate = { ...typeFilter[type] };
    const pageIncrement = type === contentTypes.SUBJECT ? 2 : 4;
    filterUpdate.pageSize += pageIncrement;
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
    if (type !== contentTypes.SUBJECT) {
      setLoadingOnGroup(type);
      setParams(prevState => ({
        ...prevState,
        pageSize: prevState.pageSize + pageIncrement,
        resourceTypes: hasActiveFilters(type) ? prevState.resourceTypes : resourceTypeMapping[type]
      }))
    }
  };

  const handleShowAll = type => {
    handleSetSubjectType(type);
  } 

  const onPagerNavigate = pagerEvent => {
    const { type, page} = pagerEvent;
    const filterUpdate = { ...typeFilter[type] };
    filterUpdate.page = page;
    setTypeFilter({ ...typeFilter, [type]: filterUpdate });
    if (type !== contentTypes.SUBJECT) {
      setLoadingOnGroup(type);
      setParams(prevState => ({
        page,
        pageSize: 8,
        resourceTypes: hasActiveFilters(type) ? prevState.resourceTypes : resourceTypeMapping[type]
      }))
    }
  }

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  const suggestion = searchData[0].suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

  return (
    <>
      <SearchHeader
        count={searchGroups.reduce((acc, item) => acc + item.totalCount, 0)}
        searchPhrase={searchParams.query}
        searchPhraseSuggestion={suggestion}
        searchPhraseSuggestionOnClick={() => {
          history.push({
            search: `?query=${suggestion}`
          })
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
  searchData: arrayOf(SearchDataShape),
  searchParams: SearchParamsShape,
  setParams: func,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default injectT(SearchContainer);
