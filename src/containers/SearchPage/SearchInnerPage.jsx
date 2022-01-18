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
}) => {
  const [showConcepts, setShowConcepts] = useState(true);
  const [typeFilter, setTypeFilter] = useState(getTypeFilter(resourceTypes));
  const [competenceGoals, setCompetenceGoals] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setTypeFilter(getTypeFilter(resourceTypes));
    setShowConcepts(true);
  }, [query, subjects, resourceTypes]);

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
      onCompleted: data => setCompetenceGoals(data.competenceGoals),
    },
  );

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

  const getActiveFilters = type =>
    typeFilter[type].filters
      ?.filter(f => f.id !== 'all' && f.active)
      .map(f => f.id) || [];

  const handleSubFilterClick = (type, filterId) => {
    updateTypeFilter(type, { page: 1 });
    const filters = typeFilter[type].filters;
    const selectedFilter = filters.find(item => filterId === item.id);
    if (filterId === 'all') {
      filters.forEach(filter => {
        filter.active = filter.id === 'all';
      });
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
    updateTypeFilter(type, {
      page: 1,
      pageSize: selected ? 4 : 8,
      selected: !selected,
    });
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
