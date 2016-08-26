/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import test from 'ava';

import formatDate from '../formatDate';

test.cb.serial('util/formatDate', t => {
  t.is(typeof formatDate, 'function');

  t.is(formatDate('2014-12-24T10:44:06Z', 'nb'), '24.12.14');
  t.is(formatDate('1978-03-07T15:00:00Z', 'nb'), '07.03.78');

  t.end();
});
