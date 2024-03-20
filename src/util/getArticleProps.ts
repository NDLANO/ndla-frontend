/**
 * Copyright (c) 2017-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getContentType } from "./getContentType";
import { GQLResource } from "../graphqlTypes";

export const getArticleProps = (resource: Pick<GQLResource, "resourceTypes" | "id" | "relevanceId"> | undefined) => {
  const hasResourceTypes = resource?.resourceTypes && resource?.resourceTypes?.length > 0;

  const contentType = hasResourceTypes && resource ? getContentType(resource) : undefined;

  const additional = resource?.relevanceId !== "urn:relevance:core";

  const label = (hasResourceTypes && resource?.resourceTypes![0]?.name) || "";
  return { contentType, label, additional };
};
