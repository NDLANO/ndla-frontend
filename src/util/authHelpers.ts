/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TokenSet } from 'openid-client';
import config from '../config';
import { fetchAuthorized } from '../util/apiHelpers';

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
    // Må finne ut hvordan sette origin på typescript måten. window.location.origin har en readonly type.
    // @ts-ignore
    window.location.origin = [
      window.location.protocol,
      '//',
      window.location.host,
      ':',
      window.location.port,
    ].join('');
  }

  return window.location.origin;
})();

export const auth0Domain =
  process.env.NODE_ENV === 'unittest' ? 'http://auth-ndla' : FEIDE_DOMAIN;

export { locationOrigin };

export function parseHash(_hash: string) {}

export function setTokenSetInLocalStorage(
  tokenSet: TokenSet,
  personal: boolean,
) {
  localStorage.setItem('access_token', tokenSet.access_token || '');
  localStorage.setItem(
    'access_token_expires_at',
    ((tokenSet.expires_at || 0) + new Date().getTime()).toString(),
  );
  localStorage.setItem('access_token_personal', personal.toString());
  localStorage.setItem('id_token_feide', tokenSet.id_token || ''); 
}

export const clearTokenSetFromLocalStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_expires_at');
  localStorage.removeItem('access_token_personal');
  localStorage.removeItem('PKCE_code');
  localStorage.removeItem('id_token_feide');
};

export const getAccessTokenPersonal = () =>
  localStorage.getItem('access_token_personal') === 'true';

export const getAccessTokenExpiresAt = () =>
  JSON.parse(localStorage.getItem('access_token_expires_at') || '0');

export const getAccessToken = () => localStorage.getItem('access_token');

export const getPKCECode = () => localStorage.getItem('PKCE_code');

export const isAccessTokenValid = () =>
  new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

const getIdTokenFeide = () => localStorage.getItem('id_token_feide');

export const initializeFeideLogin = () => {
  fetch(`${locationOrigin}/feide/login`)
    .then(json => json.json())
    .then(data => (window.location.href = data.url));
};

export const finalizeFeideLogin = async (feideLoginCode: string) => {
  return fetch(`${locationOrigin}/feide/token?code=${feideLoginCode}`, {
    credentials: 'include',
  })
    .then(json => json.json())
    .then(token => setTokenSetInLocalStorage(token, true));
};

export const feideLogout = async (logout: () => void) => {
  fetchAuthorized(
    `${locationOrigin}/feide/logout?id_token_hint=${getIdTokenFeide()}`,
  )
    .then((json: { text: () => any }) => json.text())
    .then((url: string) => {
      clearTokenSetFromLocalStorage();
      logout();
      window.location.href = url;
    });
};

let tokenRenewalTimeout: NodeJS.Timeout;

export const renewAuth = async () => {
  if (localStorage.getItem('access_token_personal') === 'true') {
    return initializeFeideLogin();
  }
};

const scheduleRenewal = async () => {
  if (localStorage.getItem('access_token_personal') !== 'true') {
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
