/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy, uniqBy } from "@ndla/util";
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_SOURCE_MATERIAL,
  RESOURCE_TYPE_CONCEPT,
} from "../../constants";
import { GQLResource, GQLResourceType } from "../../graphqlTypes";
import { contentTypeMapping } from "../../util/getContentType";

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

export const sortResources = <T extends GQLResourceLike>(resources: T[], isGrouped?: boolean) => {
  const uniq = uniqBy(resources, (res) => res.id);
  const sortedByRank = sortBy(uniq, (res) => res.rank ?? res.id);
  if (!isGrouped) {
    // TODO: Just return sortedByRank once we can remove contentType
    return sortedByRank.map((res) => {
      const firstResourceType = sortResourceTypes(res.resourceTypes ?? [])?.[0];
      return { ...res, contentType: firstResourceType ? contentTypeMapping[firstResourceType.id] : undefined };
    });
  }

  // TODO: Convert map to `sortBy` once we can remove contentType
  const withContentType = sortedByRank.map((res) => {
    const firstResourceType = sortResourceTypes(res.resourceTypes ?? [])?.[0];
    return {
      ...res,
      order: sortOrder[firstResourceType?.id ?? "default"],
      contentType: contentTypeMapping[firstResourceType?.id ?? "default"],
    };
  });
  return sortBy(withContentType, (res) => res.order);
};

type SharedResourceType = Pick<GQLResourceType, "id" | "name">;

export const sortResourceTypes = (resourceTypes: SharedResourceType[]) =>
  sortBy(resourceTypes, (type) => sortOrder[type.id] ?? sortOrder.default);
