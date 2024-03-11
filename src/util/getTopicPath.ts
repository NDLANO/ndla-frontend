/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GQLTaxonomyContext, GQLTopic } from "../graphqlTypes";

type Topic = Pick<GQLTopic, "parentId" | "id">;
export const getTopicPath = <T extends Topic>(subjectId: string, topicId: string, topics?: T[]): T[] => {
  if (!topics) return [];
  const leaf = topics.find((topic) => topicId === topic.id);
  if (!leaf) {
    return [];
  }

  const toBreadcrumb = (topic: T) => {
    if (!topic.parentId || topic.parentId === subjectId) {
      return [topic];
    }
    const parentId = topics.find((t) => topic.parentId === t.id);
    const parentPath: T[] = parentId ? toBreadcrumb(parentId) : [];
    return [...parentPath, topic];
  };

  const topicPath = toBreadcrumb(leaf);
  return topicPath;
};

export type TopicPath = { name: string; id: string };
export const getTopicPathV2 = (path: string, contexts: GQLTaxonomyContext[]) => {
  const context = contexts.find((c) => path.includes(c.path));
  if (!context) return [];
  // TODO: There's a bug in tax that sometimes returns the resource as a part of the breadcrumb.
  // We work around this by removing the last n elements from the breadcrumb array, where n is the difference between the length of the breadcrumbs and the parentIds.
  return context.breadcrumbs
    .slice(0, context.breadcrumbs.length - (context.breadcrumbs.length - context.parentIds.length))
    .map((name, i) => ({ name, id: context.parentIds[i]! }));
};
