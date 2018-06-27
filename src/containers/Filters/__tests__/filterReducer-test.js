/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer, { initialState } from '../filter';

test('reducer initalState', () => {
  const nextState = reducer(undefined, { type: '' });

  expect(nextState).toEqual(initialState);
});
