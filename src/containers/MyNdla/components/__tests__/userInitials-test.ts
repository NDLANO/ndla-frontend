/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { userInitials } from '../Avatar';

test('that function produces right initials', () => {
  expect(typeof userInitials).toBe('function');

  expect(userInitials('Nordmann')).toBe('N');
  expect(userInitials('Ole Ås Nordmann')).toBe('ON');
  expect(userInitials('Åse Ås Peter Åsen')).toBe('ÅÅ');
});
