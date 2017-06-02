/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer from '../messagesReducer';

test('reducers/messages add message', () => {
  let nextState = reducer([], {
    type: 'ADD_MESSAGE',
    payload: {
      message: 'This is a dangerous error',
      severity: 'danger',
    },
  });

  expect(nextState.length).toBe(1);
  expect(nextState[0].severity).toBe('danger');
  expect(nextState[0].message).toBe('This is a dangerous error');

  nextState = reducer(nextState, {
    type: 'ADD_MESSAGE',
    payload: {
      message: 'Another somewhat less dangerous error',
      severity: 'warning',
    },
  });

  expect(nextState.length).toBe(2);
  expect(nextState[1].severity).toBe('warning');
  expect(nextState[1].message).toBe('Another somewhat less dangerous error');

  for (let i = 0; i < 8; i += 1) {
    nextState = reducer(nextState, {
      type: 'ADD_MESSAGE',
      payload: {
        message: 'A message',
        severity: 'success',
      },
    });
  }

  expect(nextState.length).toBe(10);
  expect(nextState[9].message).toBe('A message');
  expect(nextState[9].severity).toBe('success');
});

test('reducers/messages clear message', () => {
  const currentState = [
    { id: '1', message: 'melding', severity: 'info', timeToLive: 1000 },
    { id: '2', message: 'melding', severity: 'info', timeToLive: 1000 },
  ];

  const nextState = reducer(currentState, {
    type: 'CLEAR_MESSAGE',
    payload: '1',
  });
  expect(nextState.length).toBe(1);
});

test('reducers/messages clear all messages', () => {
  let nextState = reducer([], {
    type: 'CLEAR_ALL_MESSAGES',
  });
  expect(nextState.length).toBe(0);

  for (let i = 0; i < 10; i += 1) {
    nextState = reducer(nextState, {
      type: 'ADD_MESSAGE',
      payload: {
        message: 'A message',
        severity: 'success',
      },
    });
  }
  expect(nextState.length).toBe(10);

  nextState = reducer([], {
    type: 'CLEAR_ALL_MESSAGES',
  });
  expect(nextState.length).toBe(0);
});

test('reducers/messages application error', () => {
  const nextState = reducer([], {
    type: 'APPLICATION_ERROR',
    error: true,
    payload: {
      json: {
        messages: [
          {
            field: 'Generic error',
            message: 'Another somewhat less dangerous error',
          },
        ],
      },
    },
  });

  expect(nextState.length).toBe(1);
  expect(nextState[0].severity).toBe('danger');
  expect(nextState[0].message).toBe(
    'Generic error: Another somewhat less dangerous error',
  );
});
