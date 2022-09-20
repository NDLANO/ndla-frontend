/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import queryString from 'query-string';
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
  const expiration = new Date(cookieValue.ndla_expires_at);
  const cookieParams = {
    cookieName: 'feide_auth',
    cookieValue: JSON.stringify(cookieValue),
    expiration,
  };

  setCookie(cookieParams);

  return cookieValue;
}

const clearTokenSetFromLocalStorage = () => {
  deleteCookie('feide_auth');
};

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

const getIdTokenFeide = () => getFeideCookieClient()?.id_token;

export const initializeFeideLogin = (
  from?: string,
  needsInteraction?: boolean,
) => {
  const qs = queryString.stringify({
    state: from,
    prompt: needsInteraction ? undefined : 'none',
  });

  return fetch(`${locationOrigin}/feide/login?${qs}`)
    .then(res => resolveJsonOrRejectWithError<Feide>(res))
    .then(data => {
      window.location.href = data?.url || '';
    });
};

export const finalizeFeideLogin = async (
  feideLoginCode: string,
): Promise<FeideCookie> => {
  const res = await fetch(
    `${locationOrigin}/feide/token?code=${feideLoginCode}`,
    {
      credentials: 'include',
    },
  );
  const tokenSet = await resolveJsonOrRejectWithError<Feide>(res);
  return setTokenSetInLocalStorage(tokenSet!);
};

export const feideLogout = (logout: () => void, from?: string) => {
  const state = `${from ? `&state=${from}` : ''}`;
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
