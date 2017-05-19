/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { testSaga } from 'redux-saga-test-plan';
import { hasFetched } from '../subjectSelectors';
import * as sagas from '../subjectSagas';
import * as api from '../subjectApi';
import * as actions from '../subjectActions';
import { getAccessToken } from '../../App/sessionSelectors';

test('subjectSagas fetchSubjects', () => {
  const token = '12345678';
  const saga = testSaga(sagas.fetchSubjects);
  saga
    .next()
    .select(getAccessToken)
    .next(token)
    .call(api.fetchSubjects, token)

    .next([{ id: '123', name: 'Matematikk' }])
    .put({ type: actions.setSubjects.toString(), payload: [{ id: '123', name: 'Matematikk' }] })

    .next()
    .isDone();
});

test('subjectSagas watchFetchSubjects ', () => {
  const saga = testSaga(sagas.watchFetchSubjects);
  saga
    .next()
    .take(actions.fetchSubjects)

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
    .take(actions.fetchSubjects)

    .next()
    .select(hasFetched)

    .next(true)

    .finish()
    .next()
    .isDone();
});
