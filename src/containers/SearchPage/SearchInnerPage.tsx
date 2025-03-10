/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Location } from "react-router-dom";
import { useQuery } from "@apollo/client";
import SearchContainer from "./SearchContainer";
import {
  getTypeFilter,
  mapSearchDataToGroups,
  convertSearchParam,
  convertSearchStringToObject,
  getTypeParams,
  TypeFilter,
  mapSubjectDataToGroup,
} from "./searchHelpers";
import { SearchCompetenceGoal, SearchCoreElements } from "./searchTypes";
import { DefaultErrorMessage } from "../../components/DefaultErrorMessage";
import config from "../../config";
import { GQLGroupSearchQuery, GQLResourceTypeDefinition, GQLSubjectInfoFragment } from "../../graphqlTypes";
import { LtiData } from "../../interfaces";
import { groupSearchQuery } from "../../queries";
import { contentTypeMapping } from "../../util/getContentType";
import handleError from "../../util/handleError";

export const getStateSearchParams = (searchParams: Record<string, any>) => {
  const stateSearchParams: Record<string, any> = {};
  Object.keys(searchParams).forEach((key) => {
    stateSearchParams[key] = convertSearchParam(searchParams[key]);
  });
  return stateSearchParams;
};

interface Props {
  selectedFilters: string[];
  activeSubFilters: string[];
  handleSearchParamsChange: (updates: Record<string, any>) => void;
  query?: string;
  subjectIds: string[];
  subjects?: GQLSubjectInfoFragment[];
  subjectItems?: GQLSubjectInfoFragment[];
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

  const searchParams = convertSearchStringToObject(location, i18n.language);
  const stateSearchParams = isLti
    ? {
        query: !query ? undefined : query,
        subjects: convertSearchParam([...subjectIds]),
      }
    : getStateSearchParams(searchParams);

  const activeSubFiltersWithoutLeading = activeSubFilters.map((asf) => asf.substring(asf.indexOf(":urn:") + 1));

  const { data, previousData, error, loading, fetchMore } = useQuery<GQLGroupSearchQuery>(groupSearchQuery, {
    variables: {
      ...stateSearchParams,
      language: i18n.language,
      page: 1,
      pageSize: 12,
      ...getTypeParams([], resourceTypes, isLti),
      aggregatePaths: ["contexts.resourceTypes.id"],
      grepCodesList: searchParams.grepCodes,
      filterInactive: subjectIds.length === 0,
      license: "all",
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: async (data) => {
      if (initialGQLCall.current && activeSubFiltersWithoutLeading.length !== 0) {
        await fetchMore({
          variables: {
            ...getTypeParams(activeSubFiltersWithoutLeading, resourceTypes, isLti),
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

  const getActiveFilters = (type: string) => typeFilter[type]?.selected.filter((s) => s !== "all") ?? [];

  const getActiveSubFilters = (typeFilters: Record<string, TypeFilter>) => {
    return Object.entries(typeFilters)
      .filter(([, value]) => !value.selected.includes("all") && !!value.selected.length)
      .flatMap(([key, value]) => {
        return value.selected.map((filter) => `${key}:${filter}`);
      });
  };

  const handleSubFilterClick = (type: string, filterIds: string[]) => {
    // When last added element is all, remove all other filters
    const lastAdded = filterIds[filterIds.length - 1];
    if (lastAdded === "all") {
      const updatedWithoutAllFilter = updateTypeFilter(type, { page: 1, selected: ["all"] });
      const updatedSearchParamKeys = getActiveSubFilters(updatedWithoutAllFilter);
      handleSearchParamsChange({ activeSubFilters: updatedSearchParamKeys });
      fetchMore({
        variables: getTypeParams([], resourceTypes, isLti),
      });
      return;
    }
    const updatedWithoutAllFilter = filterIds.filter((t) => t !== "all");
    const updatedTypeFilter = updateTypeFilter(type, { page: 1, selected: updatedWithoutAllFilter });
    const updatedSearchParamKeys = getActiveSubFilters(updatedTypeFilter);

    updateTypeFilter(type, { page: 1, selected: filterIds.filter((t) => t !== "all") });
    handleSearchParamsChange({ activeSubFilters: updatedSearchParamKeys });
    fetchMore({
      variables: getTypeParams(updatedWithoutAllFilter, resourceTypes, isLti),
    });
  };

  const handleFilterToggle = (resourceTypeFilter: string[]) => {
    // When last added element is all, remove all other filters
    const lastAdded = resourceTypeFilter[resourceTypeFilter.length - 1];
    if (lastAdded === "all") {
      handleSearchParamsChange({ selectedFilters: [] });
      return;
    }
    const updatedKeys = resourceTypeFilter.filter((t) => t !== "all");
    handleSearchParamsChange({ selectedFilters: updatedKeys });
  };

  const handleShowMore = (type: string) => {
    const filter = typeFilter[type];
    if (!filter) return;
    const pageSize = selectedFilters.includes("all") ? 6 : 12;
    const page = filter.page + 1;
    const currentGroup = data?.groupSearch?.find(
      (group) => type === (contentTypeMapping[group.resourceType] || group.resourceType),
    );
    const toCount = filter.page * filter.pageSize;
    updateTypeFilter(type, { page });
    if (currentGroup?.resources.length === toCount) {
      const activeFilters = getActiveFilters(type);
      const omitTypes = ["topic-article", "subject"];
      fetchMore({
        variables: {
          page: page,
          pageSize: pageSize,
          ...getTypeParams(
            activeFilters.length ? activeFilters : omitTypes.includes(type) ? [] : [type],
            omitTypes.includes(type) ? [] : resourceTypes,
            isLti,
          ),
        },
      });
    }
  };

  const searchGroups = useMemo(() => {
    const language = i18n.language !== config.defaultLocale ? i18n.language : undefined;
    const subjectSearchGroup = mapSubjectDataToGroup(subjectItems);
    const searchGroups = mapSearchDataToGroups(
      data?.groupSearch || previousData?.groupSearch,
      resourceTypes,
      ltiData,
      isLti,
      language,
      t,
    );
    return subjectSearchGroup.concat(searchGroups);
  }, [data?.groupSearch, i18n.language, isLti, ltiData, previousData?.groupSearch, resourceTypes, subjectItems, t]);

  if (error) {
    handleError(error);
    return <DefaultErrorMessage />;
  }

  const suggestion = data?.groupSearch?.[0]?.suggestions?.[0]?.suggestions?.[0]?.options?.[0]?.text;

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
      typeFilter={typeFilter}
      searchGroups={searchGroups}
      loading={loading}
      isLti={isLti}
      competenceGoals={competenceGoals}
      coreElements={coreElements}
      selectedFilters={selectedFilters}
    />
  );
};

export default SearchInnerPage;
