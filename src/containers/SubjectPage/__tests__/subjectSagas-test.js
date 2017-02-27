/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import testSaga from 'redux-saga-test-plan';
import { hasFetched } from '../subjectSelectors';
import * as sagas from '../subjectSagas';
import * as api from '../subjectApi';
import * as constants from '../subjectConstants';


test('subjectSagas fetchSubjects', () => {
  const saga = testSaga(sagas.fetchSubjects);
  saga
    .next()
    .call(api.fetchSubjects)

    .next([{ id: '123', name: 'Matematikk' }])
    .put({ type: constants.SET_SUBJECTS, payload: [{ id: '123', name: 'Matematikk' }] })

    .next()
    .isDone();
});

test('subjectSagas watchFetchSubjects ', () => {
  const saga = testSaga(sagas.watchFetchSubjects);
  saga
    .next()
    .take(constants.FETCH_SUBJECTS)

    .next()
    .select(hasFetched)

    .next(false)
    .call(sagas.fetchSubjects)

    .finish()
    .next()
    .isDone();
});

test('subjectSagas watchFetchSubjects when hasFetched is true', () => {
  const saga = testSaga(sagas.watchFetchSubjects);
  saga
    .next()
    .take(constants.FETCH_SUBJECTS)

    .next()
    .select(hasFetched)

    .next(true)

    .finish()
    .next()
    .isDone();
});
