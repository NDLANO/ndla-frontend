/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as constants from './subjectConstants';

export const initalState = {
  hasFetched: false,
  fetching: false,
  all: [],
  topics: {},
  topicIntroductions: {},
};

export default handleActions({
  [constants.FETCH_SUBJECTS]: {
    next: state => ({ ...state, fetching: true }),
    throw: state => state,
  },
  [constants.SET_SUBJECTS]: {
    next: (state, action) => ({ ...state, all: action.payload, fetching: false, hasFetched: true }),
    throw: state => state,
  },
  [constants.SET_TOPICS]: {
    next: (state, action) => {
      const { subjectId, topics } = action.payload;
      return {
        ...state,
        topics: { ...state.topics, [subjectId]: topics },
      };
    },
    throw: state => state,
  },
  [constants.SET_TOPIC_INTRODUCTIONS]: {
    next: (state, action) => {
      const { articles, topics } = action.payload;
      const topicIntroductions = topics.reduce((obj, item) => {
        const intro = articles.find(article => item.contentUri === `urn:article:${article.id}`);
        return intro ? { ...obj, [item.id]: intro } : obj;
      }, {});

      return {
        ...state,
        topicIntroductions: { ...state.topicIntroductions, ...topicIntroductions },
      };
    },
    throw: state => state,
  },
}, initalState);
