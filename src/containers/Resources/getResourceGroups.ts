/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { partition, sortBy, uniqBy } from "@ndla/util";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";
import { GQLResource } from "../../graphqlTypes";

type GQLResourceLike = Pick<GQLResource, "id" | "resourceTypes" | "rank" | "relevanceId">;

const sortResources = <T extends GQLResourceLike>(resources: T[]): T[] => {
  const uniq = uniqBy(resources, (res) => res.id);
  return sortBy(uniq, (res) => res.rank ?? res.id);
};

interface PartitionedResources<T> {
  learningpaths: T[];
  supplementaryArticles: T[];
  coreArticles: T[];
}

export const partitionResources = <T extends GQLResourceLike>(resources: T[]): PartitionedResources<T> => {
  // For some reason ts generics fails us here:')
  const sortedResources = sortResources<T>(resources);

  const [learningpaths, articles] = partition(
    sortedResources,
    (res) => !!res.resourceTypes?.some((type) => type.id.includes("learningPath")),
  );

  const [supplementaryArticles, coreArticles] = partition(articles, (a) => a.relevanceId === RELEVANCE_SUPPLEMENTARY);

  return {
    learningpaths,
    supplementaryArticles,
    coreArticles,
  };
};
