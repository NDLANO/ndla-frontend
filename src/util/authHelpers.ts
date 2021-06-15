/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import config from '../config';

const handleConfigTypes = (
  configVariable: string | boolean | undefined,
): string => {
  if (typeof configVariable === 'string') {
    return configVariable;
  }
  return '';
};

const NDLA_API_URL = handleConfigTypes(config.ndlaApiUrl);
const AUTH0_DOMAIN = 'auth.dataporten.no/oauth'; //handleConfigTypes(config.feideDomain);
const FEIDE_CLIENT_ID = handleConfigTypes(config.feideClientID);

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

type TokenSet = {
  token_type: string; //code
  access_token: string; //UUID
  expires_at: number;
  scope: string; //User allowed scope
  id_token: string; //JWT token
};

export const auth0Domain =
  process.env.NODE_ENV === 'unittest' ? 'http://auth-ndla' : AUTH0_DOMAIN;
export const feideClientId =
  process.env.NODE_ENV === 'unittest' ? '123456789' : FEIDE_CLIENT_ID;

const apiBaseUrl =
  process.env.NODE_ENV === 'unittest'
    ? 'http://ndla-api'
    : defined(NDLA_API_URL, locationOrigin);

export { locationOrigin, apiBaseUrl };

export function parseHash(_hash: string) {}

export function setTokenSetInLocalStorage(
  tokenSet: TokenSet,
  personal: boolean,
) {
  localStorage.setItem('access_token', tokenSet.access_token);
  localStorage.setItem(
    'access_token_expires_at',
    (tokenSet.expires_at * 1000 + new Date().getTime()).toString(),
  );
  localStorage.setItem('access_token_personal', personal.toString());
  //localStorage.setItem('id_token_feide', tokenSet.id_token); Not in use but is sent from feide in tokenset
}

export const clearTokenSetFromLocalStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_expires_at');
  localStorage.removeItem('access_token_personal');
  //localStorage.removeItem('id_token_feide');
};

export const getAccessTokenPersonal = () =>
  localStorage.getItem('access_token_personal') === 'true';

export const getAccessTokenExpiresAt = () =>
  JSON.parse(localStorage.getItem('access_token_expires_at') || '0');

export const getAccessToken = () => localStorage.getItem('access_token');

export const getPKCECode = () => localStorage.getItem('PKCE_code');

export const isAccessTokenValid = () =>
  new Date().getTime() < getAccessTokenExpiresAt() - 10000; // 10000ms is 10 seconds

export function loginPersonalAccessToken() {
  fetch(`${locationOrigin}/feide/login`)
    .then(json => json.json())
    .then(data => {
      localStorage.setItem('PKCE_code', data.verifier);
      window.location.href = data.url;
    });
}

export const personalAuthLogout = (returnToLogin: boolean) => {
  fetch(`${locationOrigin}/feide/logout`)
    .then(() => clearTokenSetFromLocalStorage())
    .then(() => (window.location.href = returnToLogin ? '/login' : '/'));
};

let tokenRenewalTimeout: NodeJS.Timeout;

export const renewPersonalAuth = async () => {
  let accessToken = getAccessToken();
  let code = getPKCECode();
  return fetch(
    `${locationOrigin}/feide/renew?accessToken=${accessToken}&code=${code}`,
  )
    .then(json => json.json())
    .then(data => setTokenSetInLocalStorage(data, true));
};

export const renewAuth = async () => {
  if (localStorage.getItem('access_token_personal') === 'true') {
    return renewPersonalAuth();
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
  }
  return;
};

scheduleRenewal();
