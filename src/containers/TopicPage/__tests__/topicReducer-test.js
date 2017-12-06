/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState, actions } from '../topic';
import { topics } from './mockTopics';

test('reducers/topic initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    all: {},
    fetchTopicsStatus: 'initial',
    fetchTopicArticleStatus: 'initial',
    topicIntroductions: {},
  });
});

test('reducers/topics handle set topics', () => {
  const nextState = reducer(initalState, {
    type: actions.setTopics,
    payload: {
      subjectId: 'urn:subject:1',
      topics,
    },
  });

  expect(nextState).toEqual({
    all: { 'urn:subject:1': topics },
    fetchTopicsStatus: 'success',
    fetchTopicArticleStatus: 'initial',
    topicIntroductions: {},
  });

  const nextNextState = reducer(nextState, {
    type: actions.setTopics,
    payload: {
      subjectId: 'urn:subject:2',
      topics: [],
    },
  });

  expect(nextNextState.all).toEqual({
    'urn:subject:1': topics,
    'urn:subject:2': [],
  });
});

test('reducers/topics handle set topic introductions', () => {
  const nextState = reducer(initalState, {
    type: actions.setTopicIntroductions,
    payload: {
      articleIntroductions: [
        { id: '1', introduction: { introduction: 'Test1' } },
        { id: '2', introduction: { introduction: 'Test2' } },
        { id: '3', introduction: { introduction: 'Test3' } },
      ],
      topics: [
        { id: 'topicId1', contentUri: 'urn:article:1' },
        { id: 'topicId2', contentUri: 'urn:article:3' },
        { id: 'topicId3', contentUri: 'urn:image:3' },
      ],
    },
  });

  expect(nextState.topicIntroductions).toEqual({
    topicId1: {
      introduction: 'Test1',
    },
    topicId2: {
      introduction: 'Test3',
    },
  });
});

test('reducers/topics handle fetch topics error', () => {
  const nextState = reducer(initalState, {
    type: actions.fetchTopicsError,
    payload: {},
  });

  expect(nextState).toEqual({
    all: {},
    fetchTopicsStatus: 'error',
    fetchTopicArticleStatus: 'initial',
    topicIntroductions: {},
  });
});
