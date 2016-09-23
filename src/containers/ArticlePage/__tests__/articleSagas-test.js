/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import nock from 'nock';

import SagaTester from '../../../__tests__/_SagaTester';
import reducer from '../articleReducer';
import { fetchArticle } from '../articleSagas';
import * as actions from '../articleActions';


test('searchSagas search', (t) => {
  const sagaTester = new SagaTester({
    initialState: {},
    reducers: { article: reducer, locale: () => 'nb' },
  });

  const apiMock = nock('http://ndla-api')
    .get('/article-oembed/raw/nb/123')
    .reply(200, { id: 123, title: 'unit test' });

  const task = sagaTester.start(fetchArticle.bind(undefined, 123));

  return task.done.then(() => {
    t.truthy(sagaTester.wasCalled(actions.setArticle().type));

    t.deepEqual(sagaTester.getState().article.title, 'unit test');
    t.deepEqual(sagaTester.getState().article.id, 123);
    t.notThrows(() => apiMock.done());
  });
});
