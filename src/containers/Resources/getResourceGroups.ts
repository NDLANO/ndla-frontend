/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_CONCEPT,
} from "../../constants";
import { GQLResource, GQLResourceType } from "../../graphqlTypes";

export const sortOrder: Record<string, number> = {
  [RESOURCE_TYPE_LEARNING_PATH]: 1,
  [RESOURCE_TYPE_SUBJECT_MATERIAL]: 2,
  [RESOURCE_TYPE_TASKS_AND_ACTIVITIES]: 3,
  [RESOURCE_TYPE_ASSESSMENT_RESOURCES]: 4,
  [RESOURCE_TYPE_SOURCE_MATERIAL]: 5,
  [RESOURCE_TYPE_CONCEPT]: 6,
};

type GQLResourceLike = Pick<GQLResource, "id" | "resourceTypes">;

const groupResourcesByResourceTypes = <T extends GQLResourceLike>(supplementaryResources: T[], coreResources: T[]) => {
  const resources = [
    ...coreResources,
    ...supplementaryResources
      .map((resource) => ({
        ...resource,
        additional: true,
      }))
      .filter((resource) => !coreResources.find((core) => core.id === resource.id)), // don't show supp resources that exists in core
  ];
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
  [...resourceTypes].sort((a, b) => {
    if (!sortOrder[a.id] && !sortOrder[b.id]) return 0;
    if (sortOrder[a.id] === undefined) return 1;
    if (sortOrder[b.id] === undefined) return -1;
    if (sortOrder[a.id]! > sortOrder[b.id]!) return 1;
    if (sortOrder[a.id]! < sortOrder[b.id]!) return -1;
    return 0;
  });

export const getResourceGroups = <T extends GQLResourceLike>(
  resourceTypes: SharedResourceType[],
  supplementaryResources: T[],
  coreResouces: T[],
): GQLResourceType[] => {
  const groupedResources = groupResourcesByResourceTypes(supplementaryResources, coreResouces);
  const sortedResourceTypes = sortResourceTypes(resourceTypes);

  return sortedResourceTypes
    .map((type) => {
      const resources = groupedResources[type.id] ?? [];
      return { ...type, resources };
    })
    .filter((type) => type.resources.length > 0);
};
