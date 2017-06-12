/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import decode from 'jwt-decode';

export function expiresIn(token) {
  const decoded = decode(token);
  return decoded.exp - decoded.iat - 60; // Add 60 second buffer
}
