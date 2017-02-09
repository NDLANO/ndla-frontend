/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import defined from 'defined';
import { getArticle } from '../ArticlePage/articleSelectors';

const getSubjectsFromState = state => state.subjects;

export const getSubjects = createSelector(
    [getSubjectsFromState],
    subjects => subjects.all,
);

export const getSubjectById = id => createSelector(
  [getSubjects],
  subjects => subjects.find(s => s.id === id),
);

export const hasFetched = createSelector(
    [getSubjectsFromState],
    subjects => subjects.hasFetched,
);

export const getTopicsBySubjectId = subjectId => createSelector(
  [getSubjectsFromState],
  subjects => defined(subjects.topics[subjectId], []),
);

export const getTopic = (subjectId, topicId = undefined) => createSelector(
  [getTopicsBySubjectId(subjectId)],
  (topics) => {
    const search = (topic) => { // Can be optimized..
      if (topicId === topic.id) {
        return topic;
      } else if (topic.subtopics && topic.subtopics.length !== 0) {
        return topic.subtopics.map(t => search(t)).filter(t => t !== undefined)[0];
      }
      return undefined;
    };
    return search({ subtopics: topics });
  },
);

export const getTopicArticle = (subjectId, topicId) => createSelector(
  [getTopic(subjectId, topicId), state => state],
  (topic, state) => (topic ? getArticle(topic.contentUri.replace('urn:article:', ''))(state) : undefined),
);
