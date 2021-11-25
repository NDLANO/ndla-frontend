/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TokenSet, TokenSetParameters } from 'openid-client';
import { deleteCookie, getCookie, setCookie } from '@ndla/util';
import config from '../config';
import { fetchAuthorized, resolveJsonOrRejectWithError } from './apiHelpers';

interface Feide extends TokenSet {
  url?: string;
}

const handleConfigTypes = (
  configVariable: string | boolean | undefined,
): string => {
  if (typeof configVariable === 'string') {
    return configVariable;
  }
  return '';
};

const FEIDE_DOMAIN = handleConfigTypes(config.feideDomain);

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

export const auth0Domain =
  process.env.NODE_ENV === 'unittest' ? 'http://auth-ndla' : FEIDE_DOMAIN;

export { locationOrigin };

interface FeideCookie extends TokenSetParameters {
  ndla_expires_at: number;
}

function prepareCookie(tokenSet: TokenSet): FeideCookie {
  return {
    ...tokenSet,
    ndla_expires_at: (tokenSet.expires_at ?? 0) * 1000,
  };
}

function setTokenSetInLocalStorage(tokenSet: TokenSet): FeideCookie {
  const cookieValue = prepareCookie(tokenSet);
  setCookie('feide_auth', JSON.stringify(cookieValue), false);
  return cookieValue;
}

const clearTokenSetFromLocalStorage = () => {
  deleteCookie('feide_auth');
};

export const getFeideCookie = (cookies: string): FeideCookie | null => {
  const cookieString: string | null = getCookie('feide_auth', cookies);
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

export const isAccessTokenValid = (
  cookie: FeideCookie | null = getFeideCookieClient(),
): boolean => {
  const expiration = cookie?.ndla_expires_at ?? 0;
  return new Date().getTime() < expiration - 10000;
};

const getIdTokenFeide = () => getFeideCookieClient()?.id_token;

export const initializeFeideLogin = () => {
  if (!config.feideEnabled)
    return new Promise((resolve, _reject) => resolve(''));
  const lastPath = localStorage.getItem('lastPath');
  const state = `${lastPath ? `?state=${lastPath}` : ''}`;

  return fetch(`${locationOrigin}/feide/login${state}`)
    .then(res => resolveJsonOrRejectWithError<Feide>(res))
    .then(data => (window.location.href = data?.url || ''));
};

export const finalizeFeideLogin = (feideLoginCode: string) => {
  return fetch(`${locationOrigin}/feide/token?code=${feideLoginCode}`, {
    credentials: 'include',
  })
    .then(res => resolveJsonOrRejectWithError<Feide>(res))
    .then(tokenSet => setTokenSetInLocalStorage(tokenSet!!));
};

export const feideLogout = (logout: () => void) => {
  const lastPath = localStorage.getItem('lastPath');
  const state = `${lastPath ? `&state=${lastPath}` : ''}`;
  fetchAuthorized(
    `${locationOrigin}/feide/logout?id_token_hint=${getIdTokenFeide()}${state}`,
  )
    .then(res => resolveJsonOrRejectWithError<Feide>(res))
    .then(json => {
      clearTokenSetFromLocalStorage();
      logout();
      window.location.href = json?.url || '';
    });
};

export const renewAuth = () => {
  if (getFeideCookieClient()) {
    return initializeFeideLogin();
  }
  return;
};
