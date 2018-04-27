/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const getTopicPath = (subjectId, topicId, topics) => {
  const leaf = topics.find(topic => topicId === topic.id);
  if (!leaf) {
    return [];
  }

  const toBreadcrumb = topic => {
    if (!topic.parent || topic.parent === subjectId) {
      return [topic];
    }
    const parent = topics.find(t => topic.parent === t.id);
    const parentPath = toBreadcrumb(parent);
    return [...parentPath, topic];
  };

  const topicPath = toBreadcrumb(leaf);

  return topicPath;
};
