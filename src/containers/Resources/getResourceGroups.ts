/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { partition, sortBy, uniqBy } from "@ndla/util";
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_CONCEPT,
  RELEVANCE_CORE,
} from "../../constants";
import { GQLResource, GQLResourceType } from "../../graphqlTypes";

export const sortOrder: Record<string, number> = {
  [RESOURCE_TYPE_LEARNING_PATH]: 1,
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: 2,
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: 3,
  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: 4,
  [RESOURCE_TYPE_SOURCE_MATERIAL]: 5,
  [RESOURCE_TYPE_CONCEPT]: 6,
  default: 7,
};

type GQLResourceLike = Pick<GQLResource, "id" | "resourceTypes" | "rank" | "relevanceId">;

export const getResourceGroupings = <T extends GQLResourceLike>(resources: T[], resourceId?: string) => {
  let unique = uniqBy(resources, (res) => res.id);

  if (resourceId) {
    unique = unique.map((res) => ({
      ...res,
      active: resourceId ? res.id.endsWith(resourceId) : undefined,
    }));
  }
  const sortedResources = sortBy(unique, (res) => res.rank ?? res.id);
  const [coreResources, supplementaryResources] = partition(sortedResources, (r) => r.relevanceId === RELEVANCE_CORE);
  return { coreResources, supplementaryResources, sortedResources };
};

const groupResourcesByResourceTypes = <T extends GQLResourceLike>(resources: T[]) => {
  return resources.reduce<Record<string, GQLResource[]>>((obj, resource) => {
    const resourceTypesWithResources = resource.resourceTypes?.map((type) => {
      const existing = obj[type.id] ?? [];
      return { ...type, resources: [...existing, resource] };
    });
    const reduced = resourceTypesWithResources?.reduce((acc, type) => ({ ...acc, [type.id]: type.resources }), {});
    return { ...obj, ...reduced };
  }, {});
};

type SharedResourceType = Pick<GQLResourceType, "id" | "name">;

export const sortResourceTypes = (resourceTypes: SharedResourceType[]) =>
  sortBy(resourceTypes, (type) => sortOrder[type.id] ?? sortOrder.default);

export interface ResourceTypeWithResources extends GQLResourceType {
  id: string;
  name: string;
  resources: GQLResource[];
}

export const getResourceGroups = <T extends GQLResourceLike>(
  resourceTypes: SharedResourceType[],
  resources: T[],
): ResourceTypeWithResources[] => {
  const groupedResources = groupResourcesByResourceTypes(resources);
  const sortedResourceTypes = sortResourceTypes(resourceTypes);
  const usedResourceIds = new Set<string>();

  return sortedResourceTypes
    .map((type) => {
      const resourcesForType = (groupedResources[type.id] ?? []).filter(
        (resource) => !usedResourceIds.has(resource.id),
      );

      resourcesForType.forEach((resource) => usedResourceIds.add(resource.id));

      return { ...type, resources: resourcesForType };
    })
    .filter((type) => !!type.resources.length);
};
