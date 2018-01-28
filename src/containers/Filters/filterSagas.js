/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { actions, getActiveFilter } from './filter';
import * as api from './filterApi';
import { applicationError } from '../../modules/error';
import { fetchTopics } from '../TopicPage/topicSagas';

export function* fetchFilters(id) {
  try {
    const filters = yield call(api.fetchSubjectFilters, id);
    yield put(actions.fetchSubjectFiltersSuccess({ id, filters }));
  } catch (error) {
    yield put(applicationError(error));
    yield put(actions.fetchSubjectFiltersError());
  }
}

export function* watchFetchFilters() {
  while (true) {
    const { payload } = yield take(actions.fetchSubjectFilters);
    yield call(fetchFilters, payload);
  }
}

export function* watchSetActive() {
  while (true) {
    const { payload: { subjectId } } = yield take(actions.setActive);
    const activeFilter = yield select(getActiveFilter(subjectId));
    yield call(fetchTopics, subjectId, activeFilter);
  }
}

export default [watchFetchFilters, watchSetActive];
