/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import config from '../config';
import { expiresIn } from './jwtHelper';

const NDLA_API_URL = __SERVER__ ? config.ndlaApiUrl : window.config.ndlaApiUrl;
const fetch = __SERVER__ ? require('node-fetch') : window.fetch;

const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }

  return NDLA_API_URL;
})();

export { apiBaseUrl };

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
      .then(json => {
        const payload = createErrorPayload(
          res.status,
          defined(json.message, res.statusText),
          json,
        );
        reject(payload);
      })
      .catch(reject);
  });
}
export const setAccessTokenInLocalStorage = accessToken => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem(
    'access_token_expires_at',
    expiresIn(accessToken) * 1000 + new Date().getTime(),
  );
};

export const storeAccessToken = accessToken => {
  const expiresAt = expiresIn(accessToken) * 1000 + new Date().getTime();
  if (__CLIENT__) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('access_token_expires_at', expiresAt);
  } else {
    global.access_token = accessToken;
    global.access_token_expires_at = expiresAt;
  }
};

export const getAccessToken = () => {
  if (__CLIENT__) {
    return localStorage.getItem('access_token');
  }
  return global.access_token;
};

const getAccessTokenExpiresAt = () => {
  if (__CLIENT__) {
    return JSON.parse(localStorage.getItem('access_token_expires_at'));
  } else if (__SERVER__) {
    return global.access_token;
  }
  return 0;
};

export const fetchAccessToken = () =>
  fetch('/get_token').then(resolveJsonOrRejectWithError);

export const fetchWithAccessToken = (url, options = {}) => {
  const accessToken = getAccessToken();
  const expiresAt = accessToken ? getAccessTokenExpiresAt() : 0;

  if (__CLIENT__ && new Date().getTime() > expiresAt) {
    return fetchAccessToken().then(res => {
      setAccessTokenInLocalStorage(res.access_token);
      return fetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${res.access_token}` },
      });
    });
  }

  return fetch(url, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};
