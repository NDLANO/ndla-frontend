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

expectSaga.DEFAULT_TIMEOUT = 100;

test('articleSagas watchFetchConvertedArticle fetch converted article if not in state', () => {
  nock('http://ndla-api')
    .get('/article-converter/raw/nb/123')
    .reply(200, { id: 123, title: 'unit test' });

  return expectSaga(sagas.watchFetchConvertedArticle)
          .withState({ articles: {}, locale: 'nb' })
          .put(actions.setConvertedArticle({ id: 123, title: 'unit test' }))

          .dispatch({ type: constants.FETCH_CONVERTED_ARTICLE, payload: 123 })
          .run({ silenceTimeout: true });
});

test('articleSagas watchFetchConvertedArticle do not refetch existing article ', () =>
    expectSaga(sagas.watchFetchConvertedArticle)
      .withState({ articles: { 123: { id: 123, converted: true } }, locale: 'nb' })
      .dispatch({ type: constants.FETCH_CONVERTED_ARTICLE, payload: 123 })
      .run({ silenceTimeout: true }));

test('articleSagas watchFetchArticles', () => {
  nock('http://ndla-api')
    .get('/article-api/v1/articles?ids=1,2,3')
    .reply(200, { results: [{ id: 1 }, { id: 2 }, { id: 3 }] });

  const expected = expectSaga(sagas.watchFetchArticles)
          .withState({ articles: {}, locale: 'nb' })
          .put(actions.setArticles([{ id: 1 }, { id: 2 }, { id: 3 }]))
          .dispatch({ type: constants.FETCH_ARTICLES, payload: [1, 2, 3] })
          .run({ silenceTimeout: true });
  return expected;
  // return expected.then(() => {
  //   expect(() => apiMock.done()).not.toThrow();
  // }).catch(() => {
  //   expect(() => apiMock.done()).not.toThrow();
  //   return expected;
  // });
  // console.log('test');
  // return expected.catch().then(() => {
  //   expect(1).toBe(2);
  //   expect(() => apiMock.done()).not.toThrow();
  //   return expected;
  // });
});
