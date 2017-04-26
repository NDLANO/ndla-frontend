/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export function parseQueryString(query) {
  const entries = Array.from(new URLSearchParams(query));
  return entries.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

export function createQueryString(object) {
  const params = new URLSearchParams(); // new URLSearchParams(object) Sending object in constructer does'nt work in Chrome (56)
  Object.keys(object).forEach((key) => {
    const str = typeof object[key] === 'string' ? object[key] : JSON.stringify(object[key]);
    params.set(key, str);
  });
  return params.toString();
}
