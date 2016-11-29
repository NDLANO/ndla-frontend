/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState } from '../subjectReducer';
import * as constants from '../subjectConstants';

test('reducers/subject initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: false,
    all: [],
  });
});

test('reducers/subject handle fetch subjects', () => {
  const nextState = reducer(undefined, { type: constants.FETCH_SUBJECTS });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: true,
    all: [],
  });
});

const subjects = [
  {
    id: 'urn:subject:4160',
    name: 'physics',
  },
  {
    id: 'urn:subject:40964264',
    name: 'Medieuttrykk og mediesamfunnet',
  },
];

test('reducers/subjects handle set subjects', () => {
  const nextState = reducer(initalState, {
    type: constants.SET_SUBJECTS,
    payload: subjects,
  });

  expect(nextState).toEqual({
    hasFetched: true,
    fetching: false,
    all: subjects,
  });
});
