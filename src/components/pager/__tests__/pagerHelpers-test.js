/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';
import { getRange, stepNumbers } from '../pagerHelpers';

test('pagerHelpers getRange', (t) => {
  t.deepEqual(getRange(1, 5), [1, 5], '1,5');
  t.deepEqual(getRange(2, 5), [1, 5], '1,5');
  t.deepEqual(getRange(3, 5), [1, 5], '1,5');

  t.deepEqual(getRange(4, 10), [2, 6], '4,10');
  t.deepEqual(getRange(22, 23), [19, 23], '22,23');
  t.deepEqual(getRange(23, 23), [19, 23], '22,23');

  t.deepEqual(getRange(1, 1), [1, 1], '1,1');
  t.deepEqual(getRange(2, 3), [1, 3], '2,3');
  t.deepEqual(getRange(3, 3), [1, 3], '3,3');
});

test('pagerHelpers stepNumbers', (t) => {
  t.deepEqual(stepNumbers(1, 10), [1, 2, 3, 4, 5], '1,10');
  t.deepEqual(stepNumbers(2, 10), [1, 2, 3, 4, 5], '2,10');
  t.deepEqual(stepNumbers(3, 10), [1, 2, 3, 4, 5], '3,10');
  t.deepEqual(stepNumbers(4, 10), [2, 3, 4, 5, 6], '4,10');
  t.deepEqual(stepNumbers(5, 10), [3, 4, 5, 6, 7], '5,10');

  t.deepEqual(stepNumbers(1, 5), [1, 2, 3, 4, 5], '1,5');
  t.deepEqual(stepNumbers(2, 5), [1, 2, 3, 4, 5], '2,5');
  t.deepEqual(stepNumbers(3, 5), [1, 2, 3, 4, 5], '3,5');
  t.deepEqual(stepNumbers(4, 5), [1, 2, 3, 4, 5], '4,5');
  t.deepEqual(stepNumbers(5, 5), [1, 2, 3, 4, 5], '5,5');

  t.deepEqual(stepNumbers(1, 1), [1]);
  t.deepEqual(stepNumbers(2, 2), [1, 2]);
  t.deepEqual(stepNumbers(3, 3), [1, 2, 3]);
  t.deepEqual(stepNumbers(4, 4), [1, 2, 3, 4]);
  t.deepEqual(stepNumbers(5, 5), [1, 2, 3, 4, 5]);
});
