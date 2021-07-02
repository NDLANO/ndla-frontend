/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { htmlTitle } from '../titleHelper';

test('title with elements gets formatted correctly', () => {
  expect(htmlTitle('Page', ['With', 'Many', 'Elements', 'Together'])).toBe(
    'Page - With - Many - Elements - Together',
  );
  expect(htmlTitle('Page', ['Subject', 'NDLA'])).toBe('Page - Subject - NDLA');
  expect(htmlTitle('Page', [undefined, 'NDLA'])).toBe('Page - NDLA');
  expect(htmlTitle(undefined, [undefined, 'NDLA'])).toBe(' - NDLA');
  expect(htmlTitle('Standalone', [])).toBe('Standalone');
  expect(htmlTitle('Standalone', [undefined])).toBe('Standalone');
  expect(htmlTitle('Without elements')).toBe('Without elements');
  expect(htmlTitle(undefined)).toBe('');
});
