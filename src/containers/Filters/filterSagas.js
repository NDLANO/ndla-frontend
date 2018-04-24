/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select, takeEvery } from 'redux-saga/effects';
import { actions, filterHasFetched } from './filter';
import * as api from './filterApi';
import { applicationError } from '../../modules/error';
import { fetchTopicsFiltered } from '../TopicPage/topicSagas';

export function* fetchSubjectFilters(id) {
  try {
    const filters = yield call(api.fetchSubjectFilters, id);
    yield put(actions.fetchSubjectFiltersSuccess({ id, filters }));
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchSubjectFiltersError());
  }
}

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

export function* watchFetchFilteredTopics() {
  yield takeEvery(actions.fetchFilteredTopics, fetchTopicsFiltered);
}

export function* watchFetchSubjectFilters() {
  while (true) {
    const { payload } = yield take(actions.fetchSubjectFilters);
    yield call(fetchSubjectFilters, payload);
  }
}

export function* watchSetActive() {
  while (true) {
    const { payload: { subjectId, filterId } } = yield take(actions.setActive);
    const hasFetched = yield select(filterHasFetched({ subjectId, filterId }));
    if (!hasFetched) {
      yield put(actions.fetchFilteredTopics({ subjectId, filterId }));
    }
  }
}

export default [
  watchFetchFilters,
  watchFetchSubjectFilters,
  watchSetActive,
  watchFetchFilteredTopics,
];
