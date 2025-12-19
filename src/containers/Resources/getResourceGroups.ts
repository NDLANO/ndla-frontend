/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { sortBy, uniqBy } from "@ndla/util";
import { GQLResource, GQLResourceTypeDefinition } from "../../graphqlTypes";

type GQLResourceLike = Pick<GQLResource, "id" | "resourceTypes" | "rank" | "relevanceId">;

export const sortResources = <T extends GQLResourceLike>(
  resources: T[],
  resourceTypes: GQLResourceTypeDefinition[],
  isGrouped?: boolean,
) => {
  const uniq = uniqBy(resources, (res) => res.id);
  const sortedByRank = sortBy(uniq, (res) => res.rank ?? res.id);
  if (!isGrouped) {
    return sortedByRank;
  }
  const resourceTypeOrder = resourceTypes.reduce<Record<string, number>>((order, rt, index) => {
    order[rt.id] = index;
    return order;
  }, {});
  return sortBy(uniq, (res) => resourceTypeOrder[res.resourceTypes?.[0]?.id ?? ""] ?? Number.MAX_SAFE_INTEGER);
};
