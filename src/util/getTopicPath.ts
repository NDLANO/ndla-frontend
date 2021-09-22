/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { GQLTopicInfoFragment } from '../graphqlTypes';

export const getTopicPath = (
  subjectId: string,
  topicId: string,
  topics?: GQLTopicInfoFragment[],
) => {
  if (!topics) return [];
  const leaf = topics.find(topic => topicId === topic.id);
  if (!leaf) {
    return [];
  }

  const toBreadcrumb = (topic: GQLTopicInfoFragment) => {
    if (!topic.parent || topic.parent === subjectId) {
      return [topic];
    }
    const parent = topics.find(t => topic.parent === t.id);
    const parentPath: GQLTopicInfoFragment[] = parent
      ? toBreadcrumb(parent)
      : [];
    return [...parentPath, topic];
  };

  const topicPath = toBreadcrumb(leaf);
  return topicPath;
};
