/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import decode from 'jwt-decode';

export function getTokenExpiration(token) {
  const decoded = decode(token);
  return decoded.exp;
}
export function getTokenIssuedAt(token) {
  const decoded = decode(token);
  return decoded.iat;
}

export function isTokenExpired(token) {
  return getTokenExpiration(token) - getTokenIssuedAt(token) < 0;
}

export const decodeIdToken = idToken => decode(idToken);

export function getTimeToUpdateInMs(token) {
  return (getTokenExpiration(token) - getTokenIssuedAt(token) - 60 * 5) * 1000; // Removes 5 minutes from time to update
}
