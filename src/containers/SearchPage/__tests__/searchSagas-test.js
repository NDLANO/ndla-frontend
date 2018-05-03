/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../searchSagas';
import * as actions from '../searchActions';

test('searchSagas search', () => {
  nock('http://ndla-api')
    .get('/search-api/v1/search/?query=testing')
    .reply(200, { results: [1, 2, 3] });

  return expectSaga(sagas.watchSearch)
    .withState({ locale: 'nb', accessToken: '123456789' })
    .put(actions.setSearchResult({ results: [1, 2, 3] }))
    .dispatch(actions.search({ searchString: '?query=testing' }))
    .run({ silenceTimeout: true });
});
