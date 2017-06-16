/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import { expectSaga } from 'redux-saga-test-plan';
import * as sagas from '../articleSagas';
import * as constants from '../articleConstants';
import * as actions from '../articleActions';

expectSaga.DEFAULT_TIMEOUT = 200;

test('articleSagas watchFetchArticle fetch article if not in state', () => {
  nock('http://ndla-api')
    .get('/article-converter/json/nb/123')
    .reply(200, { id: 123, title: 'unit test' });

  return expectSaga(sagas.watchFetchArticle)
    .withState({ articles: {}, locale: 'nb' })
    .put(actions.setArticle({ id: 123, title: 'unit test' }))
    .dispatch({ type: constants.FETCH_ARTICLE, payload: 123 })
    .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle do not refetch existing article ', () =>
  expectSaga(sagas.watchFetchArticle)
    .withState({
      articles: { 123: { id: 123 } },
      locale: 'nb',
    })
    .dispatch({ type: constants.FETCH_ARTICLE, payload: 123 })
    .run({ silenceTimeout: true }));
