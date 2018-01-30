/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initialState, actions } from '../filter';

const filters = [
  {
    id: 'test1',
    name: 'test1',
  },
  {
    id: 'test2',
    name: 'test2',
  },
];

const subjectId = 'urn:subject:1';
const filterId = 'test:abcd';

test('reducer initalState', () => {
  const nextState = reducer(undefined, { type: '' });

  expect(nextState).toEqual(initialState);
});

test('handle fetched filter, set active', () => {
  const nextState = reducer(initialState, {
    type: actions.fetchSubjectFiltersSuccess,
    payload: { id: subjectId, filters },
  });

  expect(nextState).toEqual({
    all: { [subjectId]: filters },
    loadingFilters: false,
    active: {},
    hasFailed: false,
  });

  const nextNextState = reducer(nextState, {
    type: actions.setActive,
    payload: { filterId, subjectId },
  });

  expect(nextNextState).toEqual({
    ...nextState,
    active: { [subjectId]: [filterId] },
  });

  const nextNextNextState = reducer(nextNextState, {
    type: actions.setActive,
    payload: { filterId, subjectId },
  });

  expect(nextNextNextState).toEqual({
    ...nextNextState,
    active: { [subjectId]: [] },
  });
});
