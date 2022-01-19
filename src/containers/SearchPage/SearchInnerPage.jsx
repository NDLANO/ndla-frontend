/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import React, { useState, useEffect, useRef } from 'react';
import { func, arrayOf, object, string, shape, bool } from 'prop-types';
import { useTranslation } from 'react-i18next';

import SearchContainer from './SearchContainer';
import {
  SearchItemShape,
  ConceptShape,
  ResourceTypeShape,
  LtiDataShape,
} from '../../shapes';
import {
  getTypeFilter,
  mapSearchDataToGroups,
  convertSearchParam,
  converSearchStringToObject,
  convertProgramSearchParams,
  getTypeParams,
} from './searchHelpers';
import { contentTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';
import { groupSearchQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import { getDefaultLocale } from '../../config';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';

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
  programmes,
  subjectItems,
  concepts,
  resourceTypes,
  location,
  ltiData,
  isLti,
  selectedFilters,
  activeSubFilters,
}) => {
  const [showConcepts, setShowConcepts] = useState(true);
  const [typeFilter, setTypeFilter] = useState(
    getTypeFilter(resourceTypes, selectedFilters, activeSubFilters),
  );
  const [competenceGoals, setCompetenceGoals] = useState([]);
  const { t, i18n } = useTranslation();
  const initialGQLCall = useRef(true);

  useEffect(() => {
    setShowConcepts(true);
  }, [query, subjects, resourceTypes, selectedFilters]);

  const searchParams = converSearchStringToObject(location, i18n.language);
  const stateSearchParams = isLti
    ? {
        query,
        subjects: convertSearchParam([
          ...subjects,
          ...convertProgramSearchParams(programmes, i18n.language).subjects,
        ]),
      }
    : getStateSearchParams(searchParams, i18n.language);

  const activeSubFiltersWithoutLeading = activeSubFilters.map(asf =>
    asf.substring(asf.indexOf(':urn:') + 1),
  );
  // const activeSubFiltersWithoutLeading = activeSubFilters.map((asf) => asf.substring(asf.indexOf(":urn:") -1));

  const { data, previousData, error, loading, fetchMore } = useGraphQuery(
    groupSearchQuery,
    {
      variables: {
        ...stateSearchParams,
        language: i18n.language,
        page: '1',
        pageSize: '8',
        ...getTypeParams([], resourceTypes),
        aggregatePaths: ['contexts.resourceTypes.id'],
        grepCodesList: searchParams.grepCodes,
      },
      notifyOnNetworkStatusChange: true,
      onCompleted: data => {
        if (
          initialGQLCall.current &&
          activeSubFiltersWithoutLeading.length !== 0
        ) {
          fetchMore({
            variables: {
              ...getTypeParams(activeSubFiltersWithoutLeading, resourceTypes),
            },
          });
          initialGQLCall.current = false;
        }
        setCompetenceGoals(data.competenceGoals);
      },
    },
  );

  const resetSelected = () => {
    const filterUpdate = { ...typeFilter };
    for (const [key, value] of Object.entries(filterUpdate)) {
      const filters = value.filters?.map(filter => {
        filter.active = filter.id === 'all';
        return filter;
      });
      filterUpdate[key] = {
        ...value,
        filters,
        selected: false,
      };
    }
    handleSearchParamsChange({
      activeSubFilters: [],
      selectedFilters: undefined,
    });
    setTypeFilter(filterUpdate);
  };

  const updateTypeFilter = (type, updates) => {
    const filterUpdate = { ...typeFilter };
    filterUpdate[type] = {
      ...filterUpdate[type],
      ...updates,
    };
    setTypeFilter(filterUpdate);
    return filterUpdate;
  };

  const getActiveFilters = type =>
    typeFilter[type].filters
      ?.filter(f => f.id !== 'all' && f.active)
      .map(f => f.id) || [];

  const getActiveSubFilters = typeFilters => {
    return Object.entries(typeFilters)
      ?.filter(([, value]) => !!value.filters)
      ?.flatMap(([key, value]) => {
        return value.filters
          ?.filter(filter => !!filter.active && filter.id !== 'all')
          .map(filter => `${key}:${filter.id}`);
      });
  };

  const handleSubFilterClick = (type, filterId) => {
    const updatedFilters = updateTypeFilter(type, { page: 1 });
    const filters = typeFilter[type].filters;
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
      const toKeep = activeSubFilters.filter(asf => !asf.startsWith(type));
      handleSearchParamsChange({ activeSubFilters: toKeep });
      fetchMore({
        variables: getTypeParams([type], resourceTypes),
      });
    } else {
      const allFilter = filters.find(item => 'all' === item.id);
      allFilter.active = false;
      selectedFilter.active = !selectedFilter.active;
      if (!filters.some(item => item.active)) {
        allFilter.active = true;
      }
      const subFilters = getActiveSubFilters(updatedFilters ?? []);
      handleSearchParamsChange({ activeSubFilters: subFilters });
      fetchMore({
        variables: getTypeParams(
          filters
            .filter(filter => filter.active && filter.id !== 'all')
            .map(f => f.id),
          resourceTypes,
        ),
      });
    }
  };

  const handleFilterReset = () => {
    resetSelected();
  };

  const handleFilterToggle = type => {
    const selected = typeFilter[type].selected;
    const updatedFilters = updateTypeFilter(type, {
      page: 1,
      pageSize: selected ? 4 : 8,
      selected: !selected,
    });
    const selectedKeys = Object.entries(updatedFilters)
      .filter(([, value]) => !!value.selected)
      .map(([key]) => key);
    handleSearchParamsChange({ selectedFilters: selectedKeys.join(',') });
  };

  const handleShowMore = type => {
    const pageSize = showAll ? 4 : 8;
    const page = typeFilter[type].page + 1;
    const currentGroup = data.groupSearch.find(
      group =>
        type === (contentTypeMapping[group.resourceType] || group.resourceType),
    );
    const toCount = typeFilter[type].page * typeFilter[type].pageSize;
    updateTypeFilter(type, { page });
    if (currentGroup.resources.length === toCount) {
      const activeFilters = getActiveFilters(type);
      fetchMore({
        variables: {
          page: page.toString(),
          pageSize: pageSize.toString(),
          ...getTypeParams(
            activeFilters.length ? activeFilters : [type],
            resourceTypes,
          ),
        },
      });
    }
  };

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const language = i18n.language !== getDefaultLocale() && i18n.language;
  const searchGroups = mapSearchDataToGroups(
    data?.groupSearch || previousData?.groupSearch,
    resourceTypes,
    ltiData,
    isLti,
    language,
    t,
  );

  const suggestion =
    data?.groupSearch?.[0]?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]
      ?.text;

  const showAll = !Object.values(typeFilter).some(value => value.selected);

  return (
    <SearchContainer
      handleSearchParamsChange={handleSearchParamsChange}
      handleSubFilterClick={handleSubFilterClick}
      handleFilterToggle={handleFilterToggle}
      handleFilterReset={handleFilterReset}
      handleShowMore={handleShowMore}
      subjects={subjects}
      programmes={programmes}
      suggestion={suggestion}
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
      competenceGoals={competenceGoals}
    />
  );
};

SearchInnerPage.propTypes = {
  error: arrayOf(object),
  selectedFilters: arrayOf(string.isRequired).isRequired,
  activeSubFilters: arrayOf(string.isRequired).isRequired,
  handleSearchParamsChange: func,
  query: string,
  subjects: arrayOf(string),
  programmes: arrayOf(string),
  subjectItems: arrayOf(SearchItemShape),
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
};

export default SearchInnerPage;
