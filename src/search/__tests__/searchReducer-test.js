/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import reducer, { initalState } from '../searchReducer';
import * as constants from '../searchConstants';
import searchResult from './_mockSearchResult';

test('reducers/search initalState', t => {
  const nextState = reducer(undefined, { type: 'Noop' });

  t.deepEqual(nextState, {
    results: [],
    totalCount: 1,
    pageSize: 10,
    searching: false,
  });
});

test('reducers/search search', t => {
  const nextState = reducer(undefined, { type: constants.SEARCH });

  t.deepEqual(nextState, {
    results: [],
    totalCount: 1,
    pageSize: 10,
    searching: true,
  });
});

test('reducers/search searchError', t => {
  const state = { ...initalState, searching: true };
  const nextState = reducer(state, { type: constants.SEARCH_ERROR });
  t.is(nextState.searching, false);
});


test('reducers/search handle set search result', t => {
  const nextState = reducer(initalState, {
    type: constants.SET_SEARCH_RESULT,
    payload: searchResult,
  });

  t.is(nextState.totalCount, 32);
  t.is(nextState.results.length, 2);
  t.is(nextState.page, 3);
  t.is(nextState.pageSize, 2);
  t.is(nextState.searching, false);
});
