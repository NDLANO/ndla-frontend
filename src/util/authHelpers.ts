/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TokenSet, TokenSetParameters } from 'openid-client';
import { getCookie } from '@ndla/util';
import { resolveJsonOrRejectWithError } from './apiHelpers';

interface Feide extends TokenSet {
  url?: string;
}

const locationOrigin = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-frontend';
  }

  if (process.env.BUILD_TARGET === 'server') {
    return '';
  }
  if (typeof window === 'undefined') {
    return '';
  }
  if (typeof window.location.origin === 'undefined') {
    window.location = {
      ...window.location,
      origin: [
        window.location.protocol,
        '//',
        window.location.host,
        ':',
        window.location.port,
      ].join(''),
    };
  }

  return window.location.origin;
})();

export { locationOrigin };

interface FeideCookie extends TokenSetParameters {
  ndla_expires_at: number;
}

export const getFeideCookie = (cookies: string): FeideCookie | null => {
  const cookieString = getCookie('feide_auth', cookies);
  if (cookieString) {
    return JSON.parse(cookieString);
  }

  return null;
};

const getFeideCookieClient = (): FeideCookie | null => {
  return getFeideCookie(document.cookie);
};

export const getAccessToken = (cookies?: string) => {
  const cookie = getFeideCookie(cookies ?? '');
  return cookie?.access_token;
};

export const millisUntilExpiration = (
  cookie: FeideCookie | null = getFeideCookieClient(),
): number => {
  const expiration = cookie?.ndla_expires_at ?? 0;
  const currentTime = new Date().getTime();

  return Math.max(0, expiration - currentTime);
};

export const isAccessTokenValid = (
  cookie: FeideCookie | null = getFeideCookieClient(),
): boolean => {
  return millisUntilExpiration(cookie) > 10000;
};

export const initializeFeideLogin = (from?: string) => {
  const state = `${from ? `?state=${from}` : ''}`;

  return fetch(`${locationOrigin}/feide/login${state}`)
    .then(res => resolveJsonOrRejectWithError<Feide>(res))
    .then(data => {
      window.location.href = data?.url || '';
    });
};

export const renewAuth = () => {
  if (getFeideCookieClient()) {
    return initializeFeideLogin();
  }
  return;
};
