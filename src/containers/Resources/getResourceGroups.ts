/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy, uniqBy } from "@ndla/util";
import { resourceTypeSortOrder } from "../../constants";
import { GQLResource, GQLResourceType } from "../../graphqlTypes";
import { contentTypeMapping } from "../../util/getContentType";

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
    return { ...res, contentType: contentTypeMapping[firstResourceType?.id ?? "default"] };
  });
  return sortBy(withContentType, (res) => res.contentType);
};

type SharedResourceType = Pick<GQLResourceType, "id" | "name">;

export const sortResourceTypes = (resourceTypes: SharedResourceType[]) =>
  sortBy(resourceTypes, (type) => resourceTypeSortOrder[type.id] ?? resourceTypeSortOrder.default);
