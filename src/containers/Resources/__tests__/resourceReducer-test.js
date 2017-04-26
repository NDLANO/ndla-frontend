/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState } from '../resourceReducer';
import * as actions from '../resourceActions';
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
    all: { },
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

test('reducers/resources handle set article resource data', () => {
  const nextState = reducer({ all: { 1: resources } },
    {
      type: actions.setArticleResourceData,
      payload: {
        topicId: '1',
        articleResourceData: [
          { id: '1', introduction: 'Intro 1', title: 'Title 1' },
          { id: '2', introduction: 'Intro 2', title: 'Title 2' },
          { id: 'abc', introduction: 'No corresponding article resource' }],
      },
    });
  const articleResource1 = nextState.all['1'][2];
  const articleResource2 = nextState.all['1'][3];
  const articleResource3 = nextState.all['1'][4];

  expect(articleResource1.title).toBe('Title 1');
  expect(articleResource2.title).toBe('Title 2');

  expect(articleResource1.introduction).toBe('Intro 1');
  expect(articleResource2.introduction).toBe('Intro 2');

  expect(articleResource3.introduction).toBe(undefined);
});

test('reducers/resources handle set learning path resource data', () => {
  const nextState = reducer({ all: { 1: resources } },
    {
      type: actions.setLearningPathResourceData,
      payload: {
        topicId: '1',
        learningPathResourceData: [
          { id: '1', title: 'Title 1', description: 'Desc 1', coverPhotoUrl: 'https://example.com/1.jpg' },
          { id: '2', title: 'Title 2', description: 'Desc 2', coverPhotoUrl: 'https://example.com/2.jpg' },
          { id: 'abc', description: 'No corresponding learning path resource' }],
      },
    });

  const learningPathResource1 = nextState.all['1'][0];
  const learningPathResource2 = nextState.all['1'][1];
  expect(learningPathResource1.title).toBe('Title 1');
  expect(learningPathResource2.title).toBe('Title 2');
  expect(learningPathResource1.description).toBe('Desc 1');
  expect(learningPathResource2.description).toBe('Desc 2');
  expect(learningPathResource1.coverPhotoUrl).toBe('https://example.com/1.jpg');
  expect(learningPathResource2.coverPhotoUrl).toBe('https://example.com/2.jpg');
});
