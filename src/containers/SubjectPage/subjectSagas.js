/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { hasFetched } from './subjectSelectors';
import * as constants from './subjectConstants';
import * as actions from './subjectActions';
import * as api from './subjectApi';

export function* fetchSubjects() {
  try {
    const subjects = yield call(api.fetchSubjects);
    yield put(actions.setSubjects(subjects));
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchSubjects() {
  while (true) {
    yield take(constants.FETCH_SUBJECTS);
    const fetched = yield select(hasFetched);
    if (!fetched) {
      yield call(fetchSubjects);
    }
  }
}

export function* fetchTopics(subjectId) {
  try {
    const topics = yield call(api.fetchTopics, subjectId);
    yield put(actions.setTopics({ topics, subjectId }));
  } catch (error) {
    throw error;
    // TODO: handle error
    // yield put(actions.applicationError());
  }
}

export function* watchFetchTopics() {
  while (true) {
    const { payload: subjectId } = yield take(constants.FETCH_TOPICS);
    // TODO: Check if already fetched
    yield call(fetchTopics, subjectId);
  }
}

export default [
  watchFetchSubjects,
  watchFetchTopics,
];
