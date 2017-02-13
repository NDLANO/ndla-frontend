/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';
import defined from 'defined';
import { getConvertedArticle, getArticleIntroduction } from '../ArticlePage/articleSelectors';

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
  (topic, state) => (topic && topic.contentUri ? getConvertedArticle(topic.contentUri.replace('urn:article:', ''))(state) : undefined),
);

export const getSubtopics = (subjectId, topicId) => createSelector(
  [getTopic(subjectId, topicId)],
  topic => (topic ? defined(topic.subtopics, []) : []),
);

export const getSubtopicsWithDescription = (subjectId, topicId) => createSelector(
  [getSubtopics(subjectId, topicId), state => state],
  (topics, state) => topics.map((topic) => {
    if (topic && topic.contentUri) {
      const articleId = topic.contentUri.replace('urn:article:', '');
      const introduction = getArticleIntroduction(articleId)(state);
      return { ...topic, introduction };
    }
    return topic;
  }),
);
