/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as actions from './topicActions';

export const initalState = {
  all: {},
  topicIntroductions: {},
};

export default handleActions(
  {
    [actions.setTopics]: {
      next: (state, action) => {
        const { subjectId, topics } = action.payload;
        return {
          ...state,
          all: { ...state.all, [subjectId]: topics },
        };
      },
      throw: state => state,
    },
    [actions.setTopicIntroductions]: {
      next: (state, action) => {
        const { articleIntroductions, topics } = action.payload;
        // Map article introduction to topic
        const topicIntroductions = topics.reduce((obj, item) => {
          const intro = articleIntroductions.find(
            articleIntroduction =>
              item.contentUri === `urn:article:${articleIntroduction.id}`,
          );
          return intro ? { ...obj, [item.id]: intro } : obj;
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
  },
  initalState,
);
