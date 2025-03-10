/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GQLResourceType } from "../../../../graphqlTypes";

export interface ResourceData {
  title: string;
  breadcrumbs?: string[];
  resourceTypes?: Pick<GQLResourceType, "id" | "name">[];
  url: string;
}
export interface FolderResource {
  title: string;
  path: string;
}
