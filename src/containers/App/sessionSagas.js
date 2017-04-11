/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { call, put, select } from 'redux-saga-effects';
import { delay } from 'redux-saga';
import * as actions from './sessionActions';
import * as api from './sessionApi';
import { getTimeToUpdateInMs } from '../../util/jwtHelper';
import { getAccessToken } from './sessionSelectors';

export function* fetchAccessToken() {
  try {
    const accessToken = yield call(api.fetchAccessToken);
    yield put(actions.setAccessToken(accessToken.access_token));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchAccessToken() {
  if (__SERVER__) {
    return;
  }
  while (true) {
    const accessToken = yield select(getAccessToken);
    yield call(delay, getTimeToUpdateInMs(accessToken));

    yield call(fetchAccessToken);
  }
}

export default [
  watchFetchAccessToken,
];
