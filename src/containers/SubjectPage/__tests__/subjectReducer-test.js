/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { actions, initialState } from '../subjects';
import { subjects } from './mockSubjects';

test('reducers/subject initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: false,
    all: [],
    hasFetchSubjectsFailed: false,
  });
});

test('reducers/subject handle fetch subjects', () => {
  const nextState = reducer(undefined, {
    type: actions.fetchSubjects,
  });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: true,
    all: [],
    hasFetchSubjectsFailed: false,
  });
});

test('reducers/subject handle fetch subjects error', () => {
  const nextState = reducer(undefined, {
    type: actions.fetchSubjectsError,
  });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: false,
    all: [],
    hasFetchSubjectsFailed: true,
  });
});

test('reducers/subjects handle set subjects', () => {
  const nextState = reducer(initialState, {
    type: actions.setSubjects.toString(),
    payload: subjects,
  });

  expect(nextState).toEqual({
    hasFetched: true,
    fetching: false,
    all: subjects,
    hasFetchSubjectsFailed: false,
  });
});
