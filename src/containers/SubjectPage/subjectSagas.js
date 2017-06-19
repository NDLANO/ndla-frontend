/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take, call, put, select } from 'redux-saga/effects';
import { getLocale } from '../Locale/localeSelectors';
import { hasFetched, actions } from './subjects';
import * as api from './subjectApi';

export function* fetchSubjects() {
  try {
    const locale = yield select(getLocale);
    const subjects = yield call(api.fetchSubjects, locale);
    yield put(actions.setSubjects(subjects));
  } catch (error) {
    // TODO: handle error
    console.error(error); //eslint-disable-line
  }
}

export function* watchFetchSubjects() {
  while (true) {
    yield take(actions.fetchSubjects);
    const fetched = yield select(hasFetched);
    if (!fetched) {
      yield call(fetchSubjects);
    }
  }
}

export default [watchFetchSubjects];
