/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TokenSet } from 'openid-client';
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

let tokenRenewalTimeout: NodeJS.Timeout;
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

export function setTokenSetInLocalStorage(tokenSet: TokenSet, personal = true) {
  localStorage.setItem('access_token_feide', tokenSet.access_token || '');
  localStorage.setItem(
    'access_token_feide_expires_at',
    ((tokenSet.expires_at || 0) + new Date().getTime()).toString(),
  );
  localStorage.setItem('access_token_feide_personal', personal.toString());
  localStorage.setItem('id_token_feide', tokenSet.id_token || '');
}

export const clearTokenSetFromLocalStorage = () => {
  localStorage.removeItem('access_token_feide');
  localStorage.removeItem('access_token_feide_expires_at');
  localStorage.removeItem('access_token_feide_personal');
  localStorage.removeItem('PKCE_code');
  localStorage.removeItem('id_token_feide');
};

export const getAccessTokenPersonal = () =>
  localStorage.getItem('access_token_feide_personal') === 'true';

export const getAccessTokenExpiresAt = () =>
  JSON.parse(localStorage.getItem('access_token_feide_expires_at') || '0');

export const getAccessToken = () => localStorage.getItem('access_token_feide');

export const getPKCECode = () => localStorage.getItem('PKCE_code');

export const isAccessTokenValid = () =>
  new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

const getIdTokenFeide = () => localStorage.getItem('id_token_feide');

export const initializeFeideLogin = () => {
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
    .then(tokenSet => setTokenSetInLocalStorage(tokenSet!!, true));
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
  if (localStorage.getItem('access_token_feide_personal') === 'true') {
    return initializeFeideLogin();
  }
  return;
};

const scheduleRenewal = async () => {
  if (localStorage.getItem('access_token_feide_personal') !== 'true') {
    return null;
  }
  const expiresAt = getAccessTokenExpiresAt();

  const timeout = expiresAt - Date.now();
  if (timeout > 0) {
    tokenRenewalTimeout = setTimeout(async () => {
      await renewAuth();
      scheduleRenewal();
    }, timeout);
  } else {
    await renewAuth();
    scheduleRenewal();
    clearTimeout(tokenRenewalTimeout);
  }
  return;
};

if (typeof localStorage !== 'undefined') {
  scheduleRenewal();
}
