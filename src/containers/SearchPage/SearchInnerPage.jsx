/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect } from 'react';
import { func, arrayOf, object, string, shape, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';

import SearchContainer from './SearchContainer';
import {
  SearchItemShape,
  ConceptShape,
  ResourceTypeShape,
  SubjectShape,
  LtiDataShape,
} from '../../shapes';
import {
  getTypeFilter,
  updateSearchGroups,
  convertSearchParam,
  converSearchStringToObject,
  convertProgramSearchParams,
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

const SearchInnerPage = ({
  handleSearchParamsChange,
  query,
  subjectIds,
  programmes,
  subjectItems,
  subjects,
  concepts,
  resourceTypes,
  location,
  locale,
  ltiData,
  isLti,
}) => {
  const [replaceItems, setReplaceItems] = useState(true);
  const [showConcepts, setShowConcepts] = useState(true);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter(resourceTypes));
  const [searchGroups, setSearchGroups] = useState([]);
  const [params, setParams] = useState(initalParams);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setParams(initalParams);
    setTypeFilter(getTypeFilter(resourceTypes));
    setShowConcepts(true);
  }, [query, resourceTypes]);

  const searchParams = converSearchStringToObject(location, i18n.language);
  const stateSearchParams = isLti
    ? {
        query,
        subjects: convertSearchParam([
          ...subjectIds,
          ...convertProgramSearchParams(programmes, i18n.language).subjects,
        ]),
      }
    : getStateSearchParams(searchParams, i18n.language);

  const newSearch = !params.types;
  const { data, error, loading } = useGraphQuery(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      language: i18n.language,
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
      ...getTypeParams(params.types, resourceTypes),
      aggregatePaths: ['contexts.resourceTypes.id'],
    },
    onCompleted: data => {
      setSearchGroups(
        updateSearchGroups(
          data.groupSearch,
          searchGroups,
          resourceTypes,
          params.pageSize,
          replaceItems,
          newSearch,
          ltiData,
          isLti,
          t,
        ),
      );
      resetLoading();
      setReplaceItems(true);
    },
  });

  const resetLoading = () => {
    const filterUpdate = { ...typeFilter };
    for (const [key, value] of Object.entries(filterUpdate)) {
      filterUpdate[key] = {
        ...value,
      };
    }
    setTypeFilter(filterUpdate);
  };

  const resetSelected = () => {
    const filterUpdate = { ...typeFilter };
    for (const [key, value] of Object.entries(filterUpdate)) {
      filterUpdate[key] = {
        ...value,
        selected: false,
      };
    }
    setTypeFilter(filterUpdate);
  };

  const updateTypeFilter = (type, updates) => {
    const filterUpdate = { ...typeFilter };
    filterUpdate[type] = {
      ...filterUpdate[type],
      ...updates,
    };
    setTypeFilter(filterUpdate);
  };

  const hasActiveFilters = type =>
    typeFilter[type].filters?.length &&
    !typeFilter[type].filters.find(f => f.id === 'all').active;

  const handleFilterClick = (type, filterId) => {
    updateTypeFilter(type, { page: 1 });
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

  const handleFilterReset = () => {
    resetSelected();
    setTypeFilter(getTypeFilter(resourceTypes));
    setParams({
      page: 1,
      pageSize: 4,
      types: null,
    });
  };

  const handleFilterToggle = type => {
    if (typeFilter[type].selected) {
      updateTypeFilter(type, { selected: false });
      setParams({
        page: 1,
        pageSize: 4,
        types: resourceTypeMapping[type] || type,
      });
    } else {
      updateTypeFilter(type, {
        page: 1,
        pageSize: 8,
        selected: true,
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
    const pageSize = showAll ? 4 : 8;
    const page = typeFilter[type].page + 1;
    updateTypeFilter(type, { page });
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

  const showAll = !Object.values(typeFilter).some(value => value.selected);

  return (
    <SearchContainer
      handleSearchParamsChange={handleSearchParamsChange}
      handleFilterClick={handleFilterClick}
      handleFilterToggle={handleFilterToggle}
      handleFilterReset={handleFilterReset}
      handleShowMore={handleShowMore}
      subjectIds={subjectIds}
      programmes={programmes}
      suggestion={suggestion}
      subjects={subjects}
      concepts={concepts}
      query={query}
      subjectItems={subjectItems}
      typeFilter={typeFilter}
      searchGroups={searchGroups}
      showConcepts={showConcepts}
      setShowConcepts={setShowConcepts}
      showAll={showAll}
      locale={i18n.language}
      loading={loading}
      isLti={isLti}
    />
  );
};

SearchInnerPage.propTypes = {
  error: arrayOf(object),
  handleSearchParamsChange: func,
  query: string,
  subjectIds: arrayOf(string),
  programmes: arrayOf(string),
  subjectItems: arrayOf(SearchItemShape),
  subjects: arrayOf(SubjectShape),
  concepts: arrayOf(ConceptShape),
  resourceTypes: arrayOf(
    shape({
      id: string.isRequired,
      name: string.isRequired,
      subtypes: arrayOf(ResourceTypeShape),
    }),
  ),
  ltiData: LtiDataShape,
  isLti: bool,
  location: shape({
    search: string,
    pathname: string,
  }),
  locale: string,
};

export default SearchInnerPage;
