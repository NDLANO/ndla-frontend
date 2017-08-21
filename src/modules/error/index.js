/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { handleActions, createAction } from 'redux-actions';

export const applicationError = createAction('APPLICATION_ERROR');
export const actions = {
  applicationError,
};

const initalState = {};

export default handleActions(
  {
    [actions.applicationError]: {
      next: state => state,
      throw: state => state,
    },
  },
  initalState,
);
