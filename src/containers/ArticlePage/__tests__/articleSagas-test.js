/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import nock from 'nock';

import SagaTester from '../../../__tests__/_SagaTester';
import reducer from '../articlesReducer';
import { fetchArticle } from '../articleSagas';
import * as actions from '../articleActions';


test('searchSagas search', () => {
  const sagaTester = new SagaTester({
    initialState: {},
    reducers: { articles: reducer, locale: () => 'nb' },
  });

  const apiMock = nock('http://ndla-api')
    .get('/article-converter/raw/nb/123')
    .reply(200, { id: 123, title: 'unit test' });

  const task = sagaTester.start(fetchArticle.bind(undefined, 123));

  return task.done.then(() => {
    expect(sagaTester.wasCalled(actions.setArticle().type)).toBeTruthy();

    expect(sagaTester.getState().articles['123'].title).toEqual('unit test');
    expect(() => apiMock.done()).not.toThrow();
  });
});
