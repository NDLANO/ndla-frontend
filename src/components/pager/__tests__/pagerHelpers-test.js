/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getRange, stepNumbers } from '../pagerHelpers';

it('pagerHelpers getRange', () => {
  expect(getRange(1, 5)).toEqual([1, 5]);
  expect(getRange(2, 5)).toEqual([1, 5]);
  expect(getRange(3, 5)).toEqual([1, 5]);

  expect(getRange(4, 10)).toEqual([2, 6]);
  expect(getRange(22, 23)).toEqual([19, 23]);
  expect(getRange(23, 23)).toEqual([19, 23]);

  expect(getRange(1, 1)).toEqual([1, 1]);
  expect(getRange(2, 3)).toEqual([1, 3]);
  expect(getRange(3, 3)).toEqual([1, 3]);
});

it('pagerHelpers stepNumbers', () => {
  expect(stepNumbers(1, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(2, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(3, 10)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(4, 10)).toEqual([2, 3, 4, 5, 6]);
  expect(stepNumbers(5, 10)).toEqual([3, 4, 5, 6, 7]);

  expect(stepNumbers(1, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(2, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(3, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(4, 5)).toEqual([1, 2, 3, 4, 5]);
  expect(stepNumbers(5, 5)).toEqual([1, 2, 3, 4, 5]);

  expect(stepNumbers(1, 1)).toEqual([1]);
  expect(stepNumbers(2, 2)).toEqual([1, 2]);
  expect(stepNumbers(3, 3)).toEqual([1, 2, 3]);
  expect(stepNumbers(4, 4)).toEqual([1, 2, 3, 4]);
  expect(stepNumbers(5, 5)).toEqual([1, 2, 3, 4, 5]);
});
