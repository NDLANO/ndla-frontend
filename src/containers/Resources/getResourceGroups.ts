/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { partition, sortBy, uniqBy } from "@ndla/util";
import { RELEVANCE_SUPPLEMENTARY } from "../../constants";

interface PartitionedResources<T> {
  learningpaths: T[];
  supplementaryArticles: T[];
  coreArticles: T[];
}

interface ResourceLike {
  id: string;
  resourceTypes: { id: string }[] | null;
  relevanceId: string | null;
  rank: number | null;
}

export const partitionResources = <T extends ResourceLike>(resources: T[]): PartitionedResources<T> => {
  const sortedResources = sortBy(
    uniqBy(resources, (res) => res.id),
    (res) => res.rank ?? res.id,
  );

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
