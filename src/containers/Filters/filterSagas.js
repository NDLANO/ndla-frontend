/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
import { actions } from './filter';
import * as api from './filterApi';
import { applicationError } from '../../modules/error';

export function* fetchFilters() {
  try {
    const filters = yield call(api.fetchFilters);
    yield put(actions.fetchFiltersSuccess({ filters }));
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchFiltersError());
  }
}

export function* watchFetchFilters() {
  while (true) {
    const { payload } = yield take(actions.fetchFilters);
    yield call(fetchFilters, payload);
  }
}

export default [watchFetchFilters];
