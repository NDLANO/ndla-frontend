/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import nock from 'nock';

import SagaTester from '../../../__tests__/_SagaTester';
import reducer from '../searchReducer';
import { search } from '../searchSagas';
import * as actions from '../searchActions';


test('searchSagas search', () => {
  const sagaTester = new SagaTester({
    initialState: {},
    reducers: { search: reducer, locale: () => 'nb' },
  });

  const apiMock = nock('http://ndla-api')
    .get('/article-api/v1/articles/?query=testing&page=3&sort=alfa&language=nb')
    .reply(200, { results: [1, 2, 3] });

  const task = sagaTester.start(search.bind(undefined, '?query=testing&page=3&sort=alfa'));

  return task.done.then(() => {
    expect(sagaTester.wasCalled(actions.setSearchResult().type)).toBeTruthy();

    expect(sagaTester.getState().search.results).toEqual([1, 2, 3]);
    expect(() => apiMock.done()).not.toThrow();
  });
});
