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
};

export default handleActions({
  [constants.SET_SEARCH_RESULT]: {
    next: (state, action) => action.payload,
    throw: state => state,
  },
}, initalState);
