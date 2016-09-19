/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import reducer from '../localeReducer';

test('reducers/locale', (t) => {
  t.is(
    reducer(undefined, { type: 'NONE' }),
    'nb',
    'initial state'
  );

  t.is(
    reducer(undefined, { type: 'SET_LOCALE', payload: 'en' }),
    'en',
    'set state'
  );
});
