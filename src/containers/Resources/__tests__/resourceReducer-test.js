/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState, actions } from '../resource';
import { resources, resourceTypes } from './mockResources';

test('reducers/resources initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: {},
    types: [],
  });
});

test('reducers/resources handle set resource types', () => {
  const nextState = reducer(initalState, {
    type: actions.setResourceTypes,
    payload: resourceTypes,
  });

  expect(nextState).toEqual({
    all: {},
    types: resourceTypes,
  });

  const nextNextState = reducer(nextState, {
    type: actions.setResourceTypes,
    payload: [],
  });

  expect(nextNextState.types).toEqual([]);
});

test('reducers/resources handle set topic resources', () => {
  const nextState = reducer(initalState, {
    type: actions.setTopicResources,
    payload: {
      topicId: '1',
      resources,
    },
  });

  expect(nextState).toEqual({
    all: { 1: resources },
    types: [],
  });

  const nextNextState = reducer(nextState, {
    type: actions.setTopicResources,
    payload: {
      topicId: '2',
      resources: [],
    },
  });

  expect(nextNextState.all).toEqual({
    1: resources,
    2: [],
  });
});
