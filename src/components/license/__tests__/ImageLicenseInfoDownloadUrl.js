/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { downloadUrl } from '../ImageLicenseList';

test('That downloadUrl adds download query param to image source', () => {
  expect(
    downloadUrl(
      'http://api-gateway.ndla-local/image-api/raw/394537450.jpg?width=200',
    ),
  ).toBe(
    'http://api-gateway.ndla-local/image-api/raw/394537450.jpg?width=200&download=true',
  );

  expect(
    downloadUrl('http://api-gateway.ndla-local/image-api/raw/394537450.jpg'),
  ).toBe(
    'http://api-gateway.ndla-local/image-api/raw/394537450.jpg?download=true',
  );

  expect(
    downloadUrl(
      'http://api-gateway.ndla-local/image-api/raw/394537450.jpg?download=true',
    ),
  ).toBe(
    'http://api-gateway.ndla-local/image-api/raw/394537450.jpg?download=true',
  );
});
