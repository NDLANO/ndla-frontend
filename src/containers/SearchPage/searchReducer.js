/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as constants from './searchConstants';

export const initalState = {
  results: [],
  totalCount: 1,
  pageSize: 10,
  searching: false,
};

export default handleActions(
  {
    [constants.SEARCH]: {
      next: state => ({ ...state, searching: true }),
      throw: state => state,
    },
    [constants.SET_SEARCH_RESULT]: {
      next: (state, action) => ({
        ...state,
        ...action.payload,
        searching: false,
      }),
      throw: state => state,
    },
    [constants.CLEAR_SEARCH_RESULT]: {
      next: () => initalState,
      throw: state => state,
    },
    [constants.SEARCH_ERROR]: {
      next: state => ({ ...state, searching: false }),
      throw: state => state,
    },
  },
  initalState,
);
