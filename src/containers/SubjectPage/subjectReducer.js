/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as actions from './subjectActions';

export const initalState = {
  hasFetched: false,
  fetching: false,
  all: [],
};

export default handleActions(
  {
    [actions.fetchSubjects]: {
      next: state => ({ ...state, fetching: true }),
      throw: state => state,
    },
    [actions.setSubjects]: {
      next: (state, action) => ({
        ...state,
        all: action.payload,
        fetching: false,
        hasFetched: true,
      }),
      throw: state => state,
    },
  },
  initalState,
);
