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
}, initalState);
