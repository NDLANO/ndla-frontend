/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState } from 'react';
import { func, arrayOf, object, string, shape } from 'prop-types';

import SearchContainer from './SearchContainer';
import { LocationShape, SearchItemShape, ConceptShape } from '../../shapes';
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
import {
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from '../../constants';

const resourceTypes = `
  ${RESOURCE_TYPE_SUBJECT_MATERIAL},
  ${RESOURCE_TYPE_LEARNING_PATH},
  ${RESOURCE_TYPE_TASKS_AND_ACTIVITIES},
  ${RESOURCE_TYPE_ASSESSMENT_RESOURCES},
  ${RESOURCE_TYPE_EXTERNAL_LEARNING_RESOURCES},
  ${RESOURCE_TYPE_SOURCE_MATERIAL}
`;
const contextTypes = 'topic-article';

const getStateSearchParams = searchParams => {
  const stateSearchParams = {};
  Object.keys(searchParams).forEach(key => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

const SearchInnerPage = ({
  handleSearchParamsChange,
  query,
  subjects,
  allSubjects,
  subjectItems,
  concepts,
  location,
  locale,
}) => {
  const [currentSubjectType, setCurrentSubjectType] = useState(null);
  const [replaceItems, setReplaceItems] = useState(true);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter());
  const [searchGroups, setSearchGroups] = useState([]);
  const [params, setParams] = useState({
    page: 1,
    pageSize: 4,
    types: null,
  });

  const searchParams = converSearchStringToObject(location, locale);
  const stateSearchParams = getStateSearchParams(searchParams);

  const { data, error } = useGraphQuery(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...getTypeParams(params.types, resourceTypes, contextTypes),
    },
    onCompleted: data => {
      setSearchGroups(
        updateSearchGroups(data.groupSearch, searchGroups, replaceItems),
      );
      setReplaceItems(true);
    },
  });

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

  const updateTypeFilter = (type, page) => {
    const filterUpdate = { ...typeFilter };
    filterUpdate[type] = {
      ...filterUpdate[type],
      page,
    };
    setTypeFilter(filterUpdate);
  };

  const handleFilterClick = (type, filterId) => {
    updateTypeFilter(type, 1);
    const filters = typeFilter[type].filters;
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
      setParams(prevState => ({
        ...prevState,
        page: 1,
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
        page: 1,
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
    } else {
      setCurrentSubjectType(type);
      updateTypeFilter(type, 1);
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
  };

  const handleShowMore = type => {
    const pageSize = currentSubjectType ? 8 : 4;
    const page = typeFilter[type].page + 1;
    updateTypeFilter(type, page);
    setReplaceItems(false);
    setLoadingOnGroup(type);
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
  location: LocationShape,
  locale: string,
};

export default SearchInnerPage;
