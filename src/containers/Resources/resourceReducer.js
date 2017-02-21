
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions } from 'redux-actions';
import * as actions from './resourceActions';

export const initalState = {
  all: {},
};

export default handleActions({
  [actions.setTopicResources]: {
    next: (state, action) => {
      const { topicId, resources } = action.payload;
      return {
        ...state,
        all: { ...state.all, [topicId]: resources },
      };
    },
    throw: state => state,
  },
}, initalState);
