/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';

import groupBy from './groupBy';

export const groupedSubtopicsByParent = (topics = []) =>
  groupBy(topics.filter(topic => topic.parent), 'parent');

export const toTopicMenu = (topic, topics) => {
  const groupedSubTopics = groupedSubtopicsByParent(topics);
  const subtopics = defined(groupedSubTopics[topic.id], []);
  const subtopicsWithSubtopics = subtopics.map(child =>
    toTopicMenu(child, topics),
  );

  return { ...topic, subtopics: subtopicsWithSubtopics };
};
