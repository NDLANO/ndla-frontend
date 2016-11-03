/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import reducer from '../localeReducer';

test('reducers/locale', () => {
  expect(reducer(undefined, { type: 'NONE' })).toBe('nb');

  expect(reducer(undefined, { type: 'SET_LOCALE', payload: 'en' })).toBe('en');
});
