/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initalState } from '../subjectReducer';
import * as constants from '../subjectConstants';
import { subjects, topics } from './mockSubjects';

test('reducers/subject initalState', () => {
  const nextState = reducer(undefined, { type: 'Noop' });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: false,
    all: [],
    topics: {},
    topicIntroductions: {},
  });
});

test('reducers/subject handle fetch subjects', () => {
  const nextState = reducer(undefined, { type: constants.FETCH_SUBJECTS });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: true,
    all: [],
    topics: {},
    topicIntroductions: {},
  });
});


test('reducers/subjects handle set subjects', () => {
  const nextState = reducer(initalState, {
    type: constants.SET_SUBJECTS,
    payload: subjects,
  });

  expect(nextState).toEqual({
    hasFetched: true,
    fetching: false,
    all: subjects,
    topics: {},
    topicIntroductions: {},
  });
});


test('reducers/subjects handle set topics', () => {
  const nextState = reducer(initalState, {
    type: constants.SET_TOPICS,
    payload: {
      subjectId: subjects[0].id,
      topics,
    },
  });

  expect(nextState).toEqual({
    hasFetched: false,
    fetching: false,
    all: [],
    topics: { [subjects[0].id]: topics },
    topicIntroductions: {},
  });

  const nextNextState = reducer(nextState, {
    type: constants.SET_TOPICS,
    payload: {
      subjectId: subjects[1].id,
      topics: [],
    },
  });

  expect(nextNextState.topics).toEqual({
    [subjects[0].id]: topics, [subjects[1].id]: [],
  });
});

test('reducers/subjects handle set topic introductions', () => {
  const nextState = reducer(initalState, {
    type: constants.SET_TOPIC_INTRODUCTIONS,
    payload: {
      articles: [{ id: '1', intro: 'Test1' }, { id: '2', intro: 'Test2' }, { id: '3', intro: 'Test3' }],
      topics: [{ id: 'topicId1', contentUri: 'urn:article:1' }, { id: 'topicId2', contentUri: 'urn:article:3' }, { id: 'topicId3', contentUri: 'urn:image:3' }],
    },
  });

  expect(nextState.topicIntroductions).toEqual({
    topicId1: {
      id: '1',
      intro: 'Test1',
    },
    topicId2: {
      id: '3',
      intro: 'Test3',
    },
  });
});
