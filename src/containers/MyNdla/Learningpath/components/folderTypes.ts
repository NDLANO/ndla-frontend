/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLResourceType } from "../../../../graphqlTypes";

export interface ResourceData {
  articleId?: number;
  title: string;
  breadcrumbs?: string[];
  traits?: string[];
  resourceTypes?: Pick<GQLResourceType, "id" | "name">[];
}
export interface MyNdlaResource {
  articleId?: number;
  title: string;
  path: string;
}
