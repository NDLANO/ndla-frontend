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
import { actions } from '../article';

test('articleSagas watchFetchArticle fetch article with resource info if not in state', () => {
  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:1/?language=nb')
    .reply(200, {
      id: 'urn:resource:1',
      contentUri: 'urn:article:123',
      title: 'Resource title',
    });
  nock('http://ndla-api')
    .get('/article-converter/json/nb/123')
    .reply(200, { id: 123, title: 'unit test', metaData: {} });
  nock('http://ndla-api')
    .get('/taxonomy/v1/resources/urn:resource:1/resource-types/?language=nb')
    .reply(200, [{ id: 'urn:resource-type:video' }]);

  return expectSaga(sagas.watchFetchArticle)
    .withState({ articles: { all: {} }, resources: { all: {} }, locale: 'nb' })
    .put(
      actions.setArticle({
        id: 123,
        urn: 'urn:resource:1',
        resource: {
          id: 'urn:resource:1',
          contentUri: 'urn:article:123',
          title: 'Resource title',
        },
        title: 'unit test',
        metaData: {},
        resourceTypes: [{ id: 'urn:resource-type:video' }],
      }),
    )
    .dispatch(
      actions.fetchArticle({ articleId: 123, resourceId: 'urn:resource:1' }),
    )
    .run({ silenceTimeout: true });
});

test('articleSagas watchFetchArticle do not refetch existing article ', () =>
  expectSaga(sagas.watchFetchArticle)
    .withState({
      articles: {
        all: {
          'urn:resource:1': { id: 123, urn: 'urn:resource:1', metaData: {} },
        },
      },
      locale: 'nb',
    })
    .dispatch(actions.fetchArticle({ resource: 'urn:resource:1' }))
    .run({ silenceTimeout: true }));
