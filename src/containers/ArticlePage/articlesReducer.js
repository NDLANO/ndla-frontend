/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as constants from './articleConstants';

const initalState = {};

export default handleActions(
  {
    [constants.SET_ARTICLE]: {
      next: (state, action) => ({
        ...state,
        [action.payload.id]: { ...action.payload },
      }),
      throw: state => state,
    },
  },
  initalState,
);
