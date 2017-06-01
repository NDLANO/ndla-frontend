/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState } from '../searchReducer';
import * as constants from '../searchConstants';
import searchResult from './_mockSearchResult';

test('reducers/search initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    results: [],
    totalCount: 1,
    pageSize: 10,
    searching: false,
  });
});

test('reducers/search search', () => {
  const nextState = reducer(undefined, { type: constants.SEARCH });

  expect(nextState).toEqual({
    results: [],
    totalCount: 1,
    pageSize: 10,
    searching: true,
  });
});

test('reducers/search searchError', () => {
  const state = { ...initalState, searching: true };
  const nextState = reducer(state, { type: constants.SEARCH_ERROR });
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle set search result', () => {
  const nextState = reducer(initalState, {
    type: constants.SET_SEARCH_RESULT,
    payload: searchResult,
  });

  expect(nextState.totalCount).toBe(32);
  expect(nextState.results.length).toBe(2);
  expect(nextState.page).toBe(3);
  expect(nextState.pageSize).toBe(2);
  expect(nextState.searching).toBe(false);
});

test('reducers/search handle clear search result', () => {
  const nextState = reducer(searchResult, {
    type: constants.CLEAR_SEARCH_RESULT,
  });

  expect(nextState).toEqual(initalState);
});
