/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function parseQueryString(query: string) {
  const pairs = query
    .replace('?', '')
    .split('&')
    .map(pair => pair.split('='));
  return pairs.reduce((obj, [key, value]) => ({ ...obj, [key!]: value }), {});
}

export const createQueryString = (obj: Record<string, string | number | boolean>) =>
  Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
    .join('&');
