/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */


import test from 'ava';
import nock from 'nock';
import { push } from 'react-router-redux';

import SagaTester from '../../__tests__/_SagaTester';
import reducer from '../searchReducer';
import { search } from '../searchSagas';
import * as actions from '../searchActions';


test('searchSagas search', t => {
  const sagaTester = new SagaTester({
    initialState: {},
    reducers: { search: reducer, locale: () => 'nb' },
  });

  const apiMock = nock('http://ndla-api')
    .get('/articles/?query=testing&page=3&language=nb&sort=alfa')
    .reply(200, { results: [1, 2, 3] });

  const task = sagaTester.start(search.bind(undefined, 'testing', '3', 'alfa'));

  return task.done.then(() => {
    t.truthy(sagaTester.wasCalled(actions.setSearchResult().type));
    t.truthy(sagaTester.wasCalled(push().type));

    t.deepEqual(sagaTester.getState().search.results, [1, 2, 3]);
    t.notThrows(() => apiMock.done());
  });
});
