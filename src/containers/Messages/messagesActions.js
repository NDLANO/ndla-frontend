/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const applicationError = createAction('APPLICATION_ERROR');
export const addMessage = createAction('ADD_MESSAGE');
export const clearAllMessages = createAction('CLEAR_ALL_MESSAGES');
export const clearMessage = createAction('CLEAR_MESSAGE');

export function timeoutMessage(message) {
  return dispatch =>
    setTimeout(() => dispatch(clearMessage(message.id)), message.timeToLive);
}
