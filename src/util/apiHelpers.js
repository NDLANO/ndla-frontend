/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import config from '../config';

const NDLA_API_URL = __SERVER__ ? config.ndlaApiUrl : window.config.ndlaApiUrl;

if (process.env.NODE_ENV === 'unittest') {
  global.__SERVER__ = false; //eslint-disable-line
}

const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }

  return NDLA_API_URL;
})();

export { apiBaseUrl };

export function headerWithAccessToken(token) {
  return { Authorization: `Bearer ${token}` };
}

export function apiResourceUrl(path) {
  return apiBaseUrl + path;
}

export function createErrorPayload(status, message, json) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError(res) {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve() : resolve(res.json());
    }
    return res
      .json()
      .then(json =>
        createErrorPayload(
          res.status,
          defined(json.message, res.statusText),
          json,
        ),
      )
      .catch(reject);
  });
}
