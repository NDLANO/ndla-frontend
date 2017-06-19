/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';
import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../subjectSagas';
import { actions } from '../subjects';

expectSaga.DEFAULT_TIMEOUT = 200;

test('subjectSagas watchFetchSubjects ', () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/subjects/?language=en')
    .reply(200, [{ id: 123, title: 'unit test' }]);

  return expectSaga(sagas.watchFetchSubjects)
    .withState({ subjects: { hasFetched: false }, locale: 'en' })
    .put(actions.setSubjects([{ id: 123, title: 'unit test' }]))
    .dispatch(actions.fetchSubjects())
    .run({ silenceTimeout: true });
});

test('subjectSagas watchFetchSubjects do not refetch if already fetched', () =>
  expectSaga(sagas.watchFetchSubjects)
    .withState({ subjects: { hasFetched: true }, locale: 'en' })
    .not.dispatch(actions.fetchSubjects())
    .run({ silenceTimeout: true }));
