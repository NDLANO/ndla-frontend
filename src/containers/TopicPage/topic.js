/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';
import { createSelector } from 'reselect';
import defined from 'defined';

import groupBy from '../../util/groupBy';
import { getArticle } from '../ArticlePage/article';
import { getArticleIdFromResource } from '../Resources/resourceHelpers';
import createFetchActions from '../../util/createFetchActions';

export const fetchTopicsActions = createFetchActions('TOPICS');
export const fetchTopicsWithIntroductions = createAction(
  'FETCH_TOPICS_WITH_INTRODUCTIONS',
);
export const setTopics = createAction('SET_TOPICS');
export const fetchTopicArticleActions = createFetchActions('TOPIC_ARTICLE');

export const setTopicIntroductions = createAction('SET_TOPIC_INTRODUCTIONS');

export const actions = {
  ...fetchTopicsActions,
  ...fetchTopicArticleActions,
  fetchTopicsWithIntroductions,
  setTopics,
  setTopicIntroductions,
};

export const initialState = {
  all: {},
  fetchTopicsStatus: 'initial',
  fetchTopicArticleStatus: 'initial',
  topicIntroductions: {},
};

export default handleActions(
  {
    [setTopics]: {
      next: (state, action) => {
        const { subjectId, topics } = action.payload;
        return {
          ...state,
          fetchTopicsStatus: 'success',
          all: { ...state.all, [subjectId]: topics },
        };
      },
      throw: state => state,
    },
    [setTopicIntroductions]: {
      next: (state, action) => {
        const { articleIntroductions, topics } = action.payload;
        // Map article introduction to topic
        const topicIntroductions = topics.reduce((obj, item) => {
          const article = articleIntroductions.find(
            articleIntroduction =>
              item.contentUri === `urn:article:${articleIntroduction.id}`,
          );
          return article ? { ...obj, [item.id]: article.introduction } : obj;
        }, {});

        return {
          ...state,
          topicIntroductions: {
            ...state.topicIntroductions,
            ...topicIntroductions,
          },
        };
      },
      throw: state => state,
    },
    [actions.fetchTopicsError]: {
      next: state => ({
        ...state,
        fetchTopicsStatus: 'error',
      }),
      throw: state => state,
    },
    [actions.fetchTopicArticle]: {
      next: state => ({
        ...state,
        fetchTopicArticleStatus: 'loading',
      }),
      throw: state => state,
    },
    [actions.fetchTopicArticleError]: {
      next: state => ({
        ...state,
        fetchTopicArticleStatus: 'error',
      }),
      throw: state => state,
    },
    [actions.fetchTopicArticleSuccess]: {
      next: state => ({
        ...state,
        fetchTopicArticleStatus: 'success',
      }),
      throw: state => state,
    },
  },
  initialState,
);

const getTopicsFromState = state => state.topics;

export const getTopicIntroductions = createSelector(
  [getTopicsFromState],
  topics => topics.topicIntroductions,
);

export const hasFetchedTopicsBySubjectId = subjectId =>
  createSelector(
    [getTopicsFromState],
    topics => topics.all[subjectId] !== undefined,
  );

export const getFetchTopicsStatus = createSelector(
  [getTopicsFromState],
  topics => topics.fetchTopicsStatus,
);

export const getFetchTopicArticleStatus = createSelector(
  [getTopicsFromState],
  topics => topics.fetchTopicArticleStatus,
);

export const getAllTopicsBySubjectId = subjectId =>
  createSelector([getTopicsFromState], topics =>
    defined(topics.all[subjectId], []),
  );

export const getTopicsBySubjectId = subjectId =>
  createSelector([getAllTopicsBySubjectId(subjectId)], topics =>
    topics.filter(topic => !topic.parent || topic.parent === subjectId),
  );

export const getTopicsBySubjectIdWithIntroduction = subjectId =>
  createSelector(
    [getTopicsBySubjectId(subjectId), getTopicIntroductions],
    (topics, topicIntroductions) =>
      topics.map(topic => {
        if (topic && topicIntroductions) {
          const topicIntroduction = topicIntroductions[topic.id];
          const introduction = topicIntroduction
            ? topicIntroduction.introduction
            : undefined;
          return { ...topic, introduction };
        }
        return topic;
      }),
  );

export const getTopic = (subjectId, topicId = undefined) =>
  createSelector([getAllTopicsBySubjectId(subjectId)], topics =>
    topics.find(topic => topicId === topic.id),
  );

export const getTopicArticle = (subjectId, topicId) =>
  createSelector(
    [getTopic(subjectId, topicId), state => state],
    (topic, state) =>
      topic && topic.contentUri
        ? getArticle(getArticleIdFromResource(topic))(state)
        : undefined,
  );

export const getSubtopics = (subjectId, topicId) =>
  createSelector([getAllTopicsBySubjectId(subjectId)], topics =>
    topics.filter(topic => topicId === topic.parent),
  );

export const getSubjectMenu = subjectId =>
  createSelector([getAllTopicsBySubjectId(subjectId)], topics => {
    const groupedSubtopicsByParent = groupBy(
      topics.filter(topic => topic.parent),
      'parent',
    );

    const toMenu = topic => {
      const subtopics = defined(groupedSubtopicsByParent[topic.id], []);

      const subtopicsWithSubtopics = subtopics.map(child => toMenu(child));

      return { ...topic, subtopics: subtopicsWithSubtopics };
    };

    return topics
      .filter(t => !t.parent || t.parent === subjectId)
      .map(root => toMenu(root));
  });

export const getTopicPath = (subjectId, topicId) =>
  createSelector(
    [getTopic(subjectId, topicId), getAllTopicsBySubjectId(subjectId)],
    (leaf, topics) => {
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

      return topicPath; // Remove last item (leaf topic)
    },
  );

export const getSubtopicsWithIntroduction = (subjectId, topicId) =>
  createSelector(
    [getSubtopics(subjectId, topicId), getTopicIntroductions],
    (topics, topicIntroductions) =>
      topics.map(topic => {
        if (topic && topicIntroductions) {
          const topicIntroduction = topicIntroductions[topic.id];
          const introduction = topicIntroduction
            ? topicIntroduction.introduction
            : undefined;
          return { ...topic, introduction };
        }
        return topic;
      }),
  );
