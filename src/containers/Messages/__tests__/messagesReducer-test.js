/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import reducer from '../messagesReducer';

test('reducers/messages add message', (t) => {
  let nextState = reducer([], {
    type: 'ADD_MESSAGE',
    payload: {
      message: 'This is a dangerous error',
      severity: 'danger',
    },
  });

  t.is(nextState.length, 1);
  t.is(nextState[0].severity, 'danger');
  t.is(nextState[0].message, 'This is a dangerous error');

  nextState = reducer(nextState, {
    type: 'ADD_MESSAGE',
    payload: {
      message: 'Another somewhat less dangerous error',
      severity: 'warning',
    },
  });

  t.is(nextState.length, 2);
  t.is(nextState[1].severity, 'warning');
  t.is(nextState[1].message, 'Another somewhat less dangerous error');

  for (let i = 0; i < 8; i += 1) {
    nextState = reducer(nextState, {
      type: 'ADD_MESSAGE',
      payload: {
        message: 'A message',
        severity: 'success',
      },
    });
  }

  t.is(nextState.length, 10);
  t.is(nextState[9].message, 'A message');
  t.is(nextState[9].severity, 'success');
});

test('reducers/messages clear message', (t) => {
  const currentState = [
    { id: '1', message: 'melding', severity: 'info', timeToLive: 1000 },
    { id: '2', message: 'melding', severity: 'info', timeToLive: 1000 },
  ];

  const nextState = reducer(currentState, {
    type: 'CLEAR_MESSAGE',
    payload: '1',
  });
  t.is(nextState.length, 1);
});

test('reducers/messages clear all messages', (t) => {
  let nextState = reducer([], {
    type: 'CLEAR_ALL_MESSAGES',
  });
  t.is(nextState.length, 0);

  for (let i = 0; i < 10; i += 1) {
    nextState = reducer(nextState, {
      type: 'ADD_MESSAGE',
      payload: {
        message: 'A message',
        severity: 'success',
      },
    });
  }
  t.is(nextState.length, 10);

  nextState = reducer([], {
    type: 'CLEAR_ALL_MESSAGES',
  });
  t.is(nextState.length, 0);
});

test('reducers/messages application error', (t) => {
  const nextState = reducer([], {
    type: 'APPLICATION_ERROR',
    error: true,
    payload: {
      json: {
        messages: [{ field: 'Generic error', message: 'Another somewhat less dangerous error' }],
      },
    },
  });

  t.is(nextState.length, 1);
  t.is(nextState[0].severity, 'danger');
  t.is(nextState[0].message, 'Generic error: Another somewhat less dangerous error');
});
