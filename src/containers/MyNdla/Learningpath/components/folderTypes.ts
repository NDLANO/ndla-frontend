/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export interface ResourceData {
  articleId?: number;
  title: string;
  breadcrumbs?: string[];
  traits?: string[];
  resourceTypes?: {
    id: string;
    name: string;
  }[];
}
export interface MyNdlaResource {
  articleId?: number;
  title: string;
  path: string;
}
