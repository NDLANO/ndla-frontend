/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions } from '../article';

test('reducers/article initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: {},
    status: 'initial',
  });
});

test('reducers/article set article', () => {
  const nextState = reducer(
    undefined,
    actions.setArticle({ id: 1, title: 'Unit test' }),
  );

  expect(nextState).toEqual({
    all: {
      1: { id: 1, title: 'Unit test' },
    },
    status: 'initial',
  });
});

test('reducers/article set multiple articles', () => {
  const state = reducer(
    undefined,
    actions.setArticle({ id: 1, title: 'Unit test 1' }),
  );
  const nextState = reducer(
    state,
    actions.setArticle({ id: 2, title: 'Unit test 2' }),
  );

  expect(nextState).toEqual({
    all: {
      1: { id: 1, title: 'Unit test 1' },
      2: { id: 2, title: 'Unit test 2' },
    },
    status: 'initial',
  });
});

test('reducers/article overwrite articles with same id', () => {
  const nextState = reducer(
    {
      all: { 1: { id: 1, title: 'Unit test 1' } },
      status: 'initial',
    },
    actions.setArticle({ id: 1, title: 'Unit test 2' }),
  );

  expect(nextState).toEqual({
    all: {
      1: { id: 1, title: 'Unit test 2' },
    },
    status: 'initial',
  });
});
