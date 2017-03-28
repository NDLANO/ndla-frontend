/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createAction } from 'redux-actions';

export const setAccessToken = createAction('SET_ACCESS_TOKEN');
export const fetchAccessToken = createAction('FETCH_ACCESS_TOKEN');
