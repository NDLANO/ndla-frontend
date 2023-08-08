/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Location } from 'react-router-dom';
import SearchContainer from './SearchContainer';
import {
  getTypeFilter,
  mapSearchDataToGroups,
  convertSearchParam,
  converSearchStringToObject,
  convertProgramSearchParams,
  getTypeParams,
  TypeFilter,
} from './searchHelpers';
import { contentTypeMapping } from '../../util/getContentType';
import handleError from '../../util/handleError';
import { groupSearchQuery } from '../../queries';
import { useGraphQuery } from '../../util/runQueries';
import config, { getDefaultLocale } from '../../config';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLGroupSearchQuery,
  GQLResourceTypeDefinition,
  GQLSubjectInfoFragment,
} from '../../graphqlTypes';
import { LtiData } from '../../interfaces';

const getStateSearchParams = (searchParams: Record<string, any>) => {
  const stateSearchParams: Record<string, any> = {};
  Object.keys(searchParams).forEach((key) => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

export interface SubjectItem {
  id: string;
  title: string;
  url: string;
  img?: { url: string };
}

export type SearchCompetenceGoal =
  Required<GQLGroupSearchQuery>['competenceGoals'][0];

export type SearchCoreElements =
  Required<GQLGroupSearchQuery>['coreElements'][0];
interface Props {
  selectedFilters: string[];
  activeSubFilters: string[];
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  query?: string;
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
  programmeNames: string[];
  subjectItems?: SubjectItem[];
  resourceTypes?: GQLResourceTypeDefinition[];
  ltiData?: LtiData;
  isLti?: boolean;
  location?: Location;
}

const SearchInnerPage = ({
  handleSearchParamsChange,
  query,
  subjectIds,
  programmeNames,
  subjectItems,
  subjects,
  resourceTypes,
  ltiData,
  isLti,
  selectedFilters,
  activeSubFilters,
  location,
}: Props) => {
  const { t, i18n } = useTranslation();
  const [typeFilter, setTypeFilter] = useState<Record<string, TypeFilter>>({});
  const [competenceGoals, setCompetenceGoals] = useState<
    SearchCompetenceGoal[]
  >([]);
  const [coreElements, setCoreElements] = useState<SearchCoreElements[]>([]);
  const initialGQLCall = useRef(true);

  useEffect(() => {
    setTypeFilter(
      getTypeFilter(resourceTypes, selectedFilters, activeSubFilters, t),
    );
  }, [resourceTypes, selectedFilters, activeSubFilters, t]);

  const searchParams = converSearchStringToObject(location, i18n.language);
  const stateSearchParams = isLti
    ? {
        query,
        subjects: convertSearchParam([
          ...subjectIds,
          ...convertProgramSearchParams(programmeNames, i18n.language).subjects,
        ]),
      }
    : getStateSearchParams(searchParams);

  const activeSubFiltersWithoutLeading = activeSubFilters.map((asf) =>
    asf.substring(asf.indexOf(':urn:') + 1),
  );

  const { data, previousData, error, loading, fetchMore } =
    useGraphQuery<GQLGroupSearchQuery>(groupSearchQuery, {
      variables: {
        ...stateSearchParams,
        language: i18n.language,
        page: 1,
        pageSize: 12,
        ...getTypeParams([], resourceTypes),
        aggregatePaths: ['contexts.resourceTypes.id'],
        grepCodesList: searchParams.grepCodes,
        filterInactive:
          config.filterInactiveContexts && subjectIds.length === 0,
      },
      notifyOnNetworkStatusChange: true,
      onCompleted: async (data) => {
        if (
          initialGQLCall.current &&
          activeSubFiltersWithoutLeading.length !== 0
        ) {
          await fetchMore({
            variables: {
              ...getTypeParams(activeSubFiltersWithoutLeading, resourceTypes),
            },
          });
          initialGQLCall.current = false;
        }
        setCompetenceGoals(data.competenceGoals ?? []);
        setCoreElements(data.coreElements ?? []);
      },
    });

  const resetSelected = () => {
    const filterUpdate = { ...typeFilter };
    for (const [key, value] of Object.entries(filterUpdate)) {
      const filters = value.filters?.map((filter) => {
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

  const updateTypeFilter = <K extends keyof TypeFilter>(
    type: string,
    updates: Pick<TypeFilter, K>,
  ) => {
    const filterUpdate = { ...typeFilter };
    const filter = filterUpdate[type];
    if (!filter) return filterUpdate;
    filterUpdate[type] = {
      ...filter,
      ...updates,
    };
    setTypeFilter(filterUpdate);
    return filterUpdate;
  };

  const getActiveFilters = (type: string) =>
    typeFilter[type]?.filters
      .filter((f) => f.id !== 'all' && f.active)
      .map((f) => f.id) ?? [];

  const getActiveSubFilters = (typeFilters: Record<string, TypeFilter>) => {
    return Object.entries(typeFilters)
      ?.filter(([, value]) => !!value.filters)
      ?.flatMap(([key, value]) => {
        return value.filters
          ?.filter((filter) => !!filter.active && filter.id !== 'all')
          .map((filter) => `${key}:${filter.id}`);
      });
  };

  const handleSubFilterClick = (type: string, filterId: string) => {
    const updatedFilters = updateTypeFilter(type, { page: 1 });
    const filters = typeFilter[type]?.filters;
    const selectedFilter = filters?.find((item) => filterId === item.id);
    if (!filters || !selectedFilter) return;
    if (filterId === 'all') {
      filters.forEach((filter) => {
        filter.active = filter.id === 'all';
      });
      const toKeep = activeSubFilters.filter((asf) => !asf.startsWith(type));
      handleSearchParamsChange({ activeSubFilters: toKeep });
      fetchMore({
        variables: getTypeParams([type], resourceTypes),
      });
    } else {
      const allFilter = filters.find((item) => 'all' === item.id)!;
      allFilter.active = false;
      selectedFilter.active = !selectedFilter.active;
      if (!filters.some((item) => item.active)) {
        allFilter.active = true;
      }
      const subFilters = getActiveSubFilters(updatedFilters ?? []);
      handleSearchParamsChange({ activeSubFilters: subFilters });
      fetchMore({
        variables: getTypeParams(
          filters
            .filter((filter) => filter.active && filter.id !== 'all')
            .map((f) => f.id),
          resourceTypes,
        ),
      });
    }
  };

  const handleFilterReset = () => {
    resetSelected();
  };

  const handleFilterToggle = (type: string) => {
    const selected = typeFilter[type]?.selected ?? false;
    const updatedFilters = updateTypeFilter(type, {
      page: 1,
      pageSize: selected ? 6 : 12,
      selected: !selected,
    });
    const selectedKeys = Object.entries(updatedFilters)
      .filter(([, value]) => !!value.selected)
      .map(([key]) => key);
    handleSearchParamsChange({ selectedFilters: selectedKeys.join(',') });
  };

  const handleShowMore = (type: string) => {
    const filter = typeFilter[type];
    if (!filter) return;
    const pageSize = showAll ? 6 : 12;
    const page = filter.page + 1;
    const currentGroup = data?.groupSearch?.find(
      (group) =>
        type === (contentTypeMapping[group.resourceType] || group.resourceType),
    );
    const toCount = filter.page * filter.pageSize;
    updateTypeFilter(type, { page });
    if (currentGroup?.resources.length === toCount) {
      const activeFilters = getActiveFilters(type);
      fetchMore({
        variables: {
          page: page,
          pageSize: pageSize,
          ...getTypeParams(
            activeFilters.length
              ? activeFilters
              : type === 'topic-article'
              ? []
              : [type],
            type === 'topic-article' ? [] : resourceTypes,
          ),
        },
      });
    }
  };

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const language =
    i18n.language !== getDefaultLocale() ? i18n.language : undefined;
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

  const showAll = !Object.values(typeFilter).some((value) => value.selected);

  return (
    <SearchContainer
      handleSearchParamsChange={handleSearchParamsChange}
      handleSubFilterClick={handleSubFilterClick}
      handleFilterToggle={handleFilterToggle}
      handleFilterReset={handleFilterReset}
      handleShowMore={handleShowMore}
      subjectIds={subjectIds}
      suggestion={suggestion}
      subjects={subjects}
      query={query}
      subjectItems={subjectItems}
      typeFilter={typeFilter}
      searchGroups={searchGroups}
      showAll={showAll}
      locale={i18n.language}
      loading={loading}
      isLti={isLti}
      competenceGoals={competenceGoals}
      coreElements={coreElements}
    />
  );
};

export default SearchInnerPage;
