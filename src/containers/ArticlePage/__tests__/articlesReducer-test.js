/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer from '../articlesReducer';
import * as constants from '../articleConstants';

it('reducers/article initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({});
});

it('reducers/article set article', () => {
  const nextState = reducer(undefined, { type: constants.SET_ARTICLE, payload: { id: 1, title: 'Unit test' } });

  expect(nextState).toEqual({
    1: { id: 1, title: 'Unit test' },
  });
});

it('reducers/article set multiple articles', () => {
  const state = reducer(undefined, { type: constants.SET_ARTICLE, payload: { id: 1, title: 'Unit test 1' } });
  const nextState = reducer(state, { type: constants.SET_ARTICLE, payload: { id: 2, title: 'Unit test 2' } });

  expect(nextState).toEqual({
    1: { id: 1, title: 'Unit test 1' },
    2: { id: 2, title: 'Unit test 2' },
  });
});

it('reducers/article overwrite articles with same id', () => {
  const nextState = reducer({
    1: { id: 1, title: 'Unit test 1' },
  }, { type: constants.SET_ARTICLE, payload: { id: 1, title: 'Unit test 2' } });

  expect(nextState).toEqual({
    1: { id: 1, title: 'Unit test 2' },
  });
});
