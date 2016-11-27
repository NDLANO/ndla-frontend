/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put } from 'redux-saga/effects';
// import { getArticle } from './subjectSelectors';
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

function* watchFetchSubjects() {
  while (true) {
    const { payload: id } = yield take(constants.FETCH_SUBJECTS);
    // TODO: Check has fetched
    yield call(fetchSubjects, id);
  }
}

export default [
  watchFetchSubjects,
];
