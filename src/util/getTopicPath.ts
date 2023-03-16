/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GQLTopic } from '../graphqlTypes';

type Topic = Pick<GQLTopic, 'parent' | 'id'>;
export const getTopicPath = <T extends Topic>(
  subjectId: string,
  topicId: string,
  topics?: T[],
): T[] => {
  if (!topics) return [];
  const leaf = topics.find((topic) => topicId === topic.id);
  if (!leaf) {
    return [];
  }

  const toBreadcrumb = (topic: T) => {
    if (!topic.parent || topic.parent === subjectId) {
      return [topic];
    }
    const parent = topics.find((t) => topic.parent === t.id);
    const parentPath: T[] = parent ? toBreadcrumb(parent) : [];
    return [...parentPath, topic];
  };

  const topicPath = toBreadcrumb(leaf);
  return topicPath;
};
