/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GQLTaxonomyContext } from "../graphqlTypes";

export type TaxonomyContext = Pick<GQLTaxonomyContext, "path" | "breadcrumbs" | "parentIds">;
export type TopicPath = { name: string; id: string };
export const getTopicPath = (path: string, contexts: TaxonomyContext[]) => {
  const context = contexts.find((c) => path.includes(c.path));
  if (!context) return [];
  // TODO: There's a bug in tax that sometimes returns the resource as a part of the breadcrumb.
  // We work around this by removing the last n elements from the breadcrumb array, where n is the difference between the length of the breadcrumbs and the parentIds.
  return context.breadcrumbs
    .slice(0, context.breadcrumbs.length - (context.breadcrumbs.length - context.parentIds.length))
    .map((name, i) => ({ name, id: context.parentIds[i]! }));
};
