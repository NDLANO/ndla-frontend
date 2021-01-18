/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
import { func, arrayOf, object, string, shape } from 'prop-types';
import { injectT } from '@ndla/i18n';

import SearchContainer from './SearchContainer';
import {
  LocationShape,
  SearchItemShape,
  ConceptShape,
  ResourceTypeShape,
} from '../../shapes';
import {
  getTypeFilter,
  updateSearchGroups,
  convertSearchParam,
  converSearchStringToObject,
  getTypeParams,
} from './searchHelpers';
import { resourceTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';
import { groupSearchQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const initalParams = {
  page: 1,
  pageSize: 4,
  types: null,
};

let newSearch = true;

const SearchInnerPage = ({
  t,
  handleSearchParamsChange,
  query,
  subjects,
  allSubjects,
  subjectItems,
  concepts,
  resourceTypes,
  location,
  locale,
}) => {
  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [replaceItems, setReplaceItems] = useState(true);
  const [showConcepts, setShowConcepts] = useState(true);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter(resourceTypes));
  const [searchGroups, setSearchGroups] = useState([]);
  const [params, setParams] = useState(initalParams);

  useEffect(() => {
    setParams(initalParams);
    setTypeFilter(getTypeFilter(resourceTypes));
    newSearch = true;
  }, [query]);

  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);

  const { data, error } = useGraphQuery(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...getTypeParams(params.types, resourceTypes),
    },
    onCompleted: data => {
      setSearchGroups(
        updateSearchGroups(
          data.groupSearch,
          searchGroups,
          resourceTypes,
          replaceItems,
          newSearch,
          t,
        ),
      );
      resetLoading();
      setReplaceItems(true);
      if (newSearch) {
        setShowConcepts(true);
      }
      newSearch = false;
    },
  });

  const resetLoading = () => {
    const filterUpdate = { ...typeFilter };
    for (const [key, value] of Object.entries(filterUpdate)) {
      filterUpdate[key] = {
        ...value,
        loading: false,
      };
    }
    setTypeFilter(filterUpdate);
  };

  const hasActiveFilters = type =>
    typeFilter[type].filters?.length &&
    !typeFilter[type].filters.find(f => f.id === 'all').active;

  const updateTypeFilter = (type, updates) => {
    const filterUpdate = { ...typeFilter };
    filterUpdate[type] = {
      ...filterUpdate[type],
      ...updates,
    };
    setTypeFilter(filterUpdate);
  };

  const handleFilterClick = (type, filterId) => {
    updateTypeFilter(type, { page: 1, loading: true });
    const filters = typeFilter[type].filters;
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
      setParams(prevState => ({
        ...prevState,
        page: 1,
        types: resourceTypeMapping[type] || type,
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
        page: 1,
        types: filters
          .filter(filter => filter.active && filter.id !== 'all')
          .map(f => f.id)
          .join(),
      }));
    }
  };

  const handleSetSubjectType = type => {
    if (type === 'ALL') {
      setCurrentSubjectType(null);
      setParams({
        page: 1,
        pageSize: 4,
        types: null,
      });
    } else {
      setCurrentSubjectType(type);
      updateTypeFilter(type, {
        page: 1,
        ...(type !== currentSubjectType && { loading: true }),
      });
      setParams(prevState => ({
        page: 1,
        pageSize: 8,
        types: hasActiveFilters(type)
          ? prevState.types
          : resourceTypeMapping[type] || type,
      }));
    }
  };

  const handleShowMore = type => {
    const pageSize = currentSubjectType ? 8 : 4;
    const page = typeFilter[type].page + 1;
    updateTypeFilter(type, { page, loading: true });
    setReplaceItems(false);
    setParams(prevState => ({
      ...prevState,
      page,
      pageSize,
      types: hasActiveFilters(type)
        ? prevState.types
        : resourceTypeMapping[type] || type,
    }));
  };

  if (error) {
    handleError(error);
    return `Error: ${error.message}`;
  }

  const suggestion =
    data?.groupSearch?.[0]?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]
      ?.text;

  return (
    <SearchContainer
      handleSearchParamsChange={handleSearchParamsChange}
      handleFilterClick={handleFilterClick}
      handleShowMore={handleShowMore}
      handleSetSubjectType={handleSetSubjectType}
      suggestion={suggestion}
      concepts={concepts}
      query={query}
      subjects={subjects}
      allSubjects={allSubjects}
      subjectItems={subjectItems}
      currentSubjectType={currentSubjectType}
      typeFilter={typeFilter}
      searchGroups={searchGroups}
      showConcepts={showConcepts}
      setShowConcepts={setShowConcepts}
    />
  );
};

SearchInnerPage.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
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
  resourceTypes: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
      subtypes: arrayOf(ResourceTypeShape),
    }),
  ),
  location: LocationShape,
  locale: string,
};

export default injectT(SearchInnerPage);
