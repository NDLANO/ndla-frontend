/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Location } from "react-router-dom";
import SearchContainer from "./SearchContainer";
import {
  getTypeFilter,
  mapSearchDataToGroups,
  convertSearchParam,
  converSearchStringToObject,
  getTypeParams,
  TypeFilter,
} from "./searchHelpers";
import DefaultErrorMessage from "../../components/DefaultErrorMessage";
import config from "../../config";
import { GQLGroupSearchQuery, GQLResourceTypeDefinition, GQLSubjectInfoFragment } from "../../graphqlTypes";
import { LtiData } from "../../interfaces";
import { groupSearchQuery } from "../../queries";
import { contentTypeMapping } from "../../util/getContentType";
import handleError from "../../util/handleError";
import { useGraphQuery } from "../../util/runQueries";

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

export type SearchCompetenceGoal = Required<GQLGroupSearchQuery>["competenceGoals"][0];

export type SearchCoreElements = Required<GQLGroupSearchQuery>["coreElements"][0];
interface Props {
  selectedFilters: string[];
  activeSubFilters: string[];
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  query?: string;
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
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
  const [competenceGoals, setCompetenceGoals] = useState<SearchCompetenceGoal[]>([]);
  const [coreElements, setCoreElements] = useState<SearchCoreElements[]>([]);
  const initialGQLCall = useRef(true);

  useEffect(() => {
    setTypeFilter(getTypeFilter(resourceTypes, selectedFilters, activeSubFilters, t));
  }, [resourceTypes, selectedFilters, activeSubFilters, t]);

  const searchParams = converSearchStringToObject(location, i18n.language);
  const stateSearchParams = isLti
    ? {
        query: !query ? undefined : query,
        subjects: convertSearchParam([...subjectIds]),
      }
    : getStateSearchParams(searchParams);

  const activeSubFiltersWithoutLeading = activeSubFilters.map((asf) => asf.substring(asf.indexOf(":urn:") + 1));

  const { data, previousData, error, loading, fetchMore } = useGraphQuery<GQLGroupSearchQuery>(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      language: i18n.language,
      page: 1,
      pageSize: 12,
      ...getTypeParams([], resourceTypes),
      aggregatePaths: ["contexts.resourceTypes.id"],
      grepCodesList: searchParams.grepCodes,
      filterInactive: subjectIds.length === 0,
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (initialGQLCall.current && activeSubFiltersWithoutLeading.length !== 0) {
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

  const updateTypeFilter = <K extends keyof TypeFilter>(type: string, updates: Pick<TypeFilter, K>) => {
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

  const getActiveFilters = (type: string) => typeFilter[type]?.filters.filter((f) => f.active).map((f) => f.id) ?? [];

  const handleSubFilterClick = (filterIds: string[]) => {
    // When last added element is all, remove all other filters
    const lastAdded = filterIds[filterIds.length - 1];
    if (lastAdded === "all") {
      handleSearchParamsChange({ activeSubFilters: [] });
      fetchMore({
        variables: getTypeParams([], resourceTypes),
      });
    } else {
      const updatedKeys = filterIds.filter((t) => t !== "all");
      handleSearchParamsChange({ activeSubFilters: updatedKeys });
      fetchMore({
        variables: getTypeParams(updatedKeys, resourceTypes),
      });
    }
  };

  const handleFilterToggle = (resourceTypeFilter: string[]) => {
    // When last added element is all, remove all other filters
    const lastAdded = resourceTypeFilter[resourceTypeFilter.length - 1];
    if (lastAdded === "all") {
      handleSearchParamsChange({ selectedFilters: [] });
    } else {
      const updatedKeys = resourceTypeFilter.filter((t) => t !== "all");
      handleSearchParamsChange({ selectedFilters: updatedKeys });
    }
  };

  const handleShowMore = (type: string) => {
    const filter = typeFilter[type];
    if (!filter) return;
    const pageSize = showAll ? 6 : 12;
    const page = filter.page + 1;
    const currentGroup = data?.groupSearch?.find(
      (group) => type === (contentTypeMapping[group.resourceType] || group.resourceType),
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
            activeFilters.length ? activeFilters : type === "topic-article" ? [] : [type],
            type === "topic-article" ? [] : resourceTypes,
          ),
        },
      });
    }
  };

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const language = i18n.language !== config.defaultLocale ? i18n.language : undefined;
  const searchGroups = mapSearchDataToGroups(
    data?.groupSearch || previousData?.groupSearch,
    resourceTypes,
    ltiData,
    isLti,
    language,
    t,
  );

  const suggestion = data?.groupSearch?.[0]?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

  const showAll = !Object.values(typeFilter).some((value) => value.selected);

  return (
    <SearchContainer
      handleSearchParamsChange={handleSearchParamsChange}
      handleSubFilterClick={handleSubFilterClick}
      handleFilterToggle={handleFilterToggle}
      handleShowMore={handleShowMore}
      subjectIds={subjectIds}
      suggestion={suggestion}
      subjects={subjects}
      query={query}
      subjectItems={subjectItems}
      typeFilter={typeFilter}
      searchGroups={searchGroups}
      showAll={showAll}
      loading={loading}
      isLti={isLti}
      competenceGoals={competenceGoals}
      coreElements={coreElements}
      selectedFilters={selectedFilters}
      activeSubFilters={activeSubFilters}
    />
  );
};

export default SearchInnerPage;
