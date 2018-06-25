/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expectSaga } from 'redux-saga-test-plan';
import nock from 'nock';
import * as sagas from '../filterSagas';
import { actions } from '../filter';

const filters = [
  {
    id: 'test1',
    name: 'test1',
  },
  {
    id: 'test2',
    name: 'test2',
  },
];

test('filters are fetched', () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/filters')
    .reply(200, filters);

  return expectSaga(sagas.watchFetchFilters)
    .put(actions.fetchFiltersSuccess({ filters }))
    .dispatch(actions.fetchFilters())
    .run({ silenceTimeout: true });
});
