/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import config from '../config';
import { expiresIn } from './jwtHelper';
import handleError from './handleError';

const __SERVER__ = process.env.BUILD_TARGET === 'server'; //eslint-disable-line
const __CLIENT__ = process.env.BUILD_TARGET === 'client'; //eslint-disable-line

const apiBaseUrl = (() => {
  if (process.env.NODE_ENV === 'unittest') {
    return 'http://ndla-api';
  }

  const NDLA_API_URL = __SERVER__
    ? config.ndlaApiUrl
    : window.DATA.config.ndlaApiUrl;

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
  }
  if (__SERVER__) {
    return global.access_token;
  }
  return 0;
};

export const fetchAccessToken = () =>
  fetch('/get_token', {
    headers: {
      'Cache-control': 'no-cache, no-store',
      Pragma: 'no-cache',
      Expires: 0,
    },
  }).then(resolveJsonOrRejectWithError);

const fetchWithHeaders = (url, options, headers) =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      ...headers,
    },
  });

export const fetchWithAccessToken = (url, options = {}) => {
  const accessToken = getAccessToken();
  const expiresAt = accessToken ? getAccessTokenExpiresAt() : 0;

  if (__CLIENT__ && new Date().getTime() > expiresAt) {
    return fetchAccessToken().then(res => {
      storeAccessToken(res.access_token);
      return fetchWithHeaders(url, options, {
        Authorization: `Bearer ${res.access_token}`,
      });
    });
  }

  return fetchWithHeaders(url, options, {
    Authorization: `Bearer ${accessToken}`,
  });
};

const uri = (() => {
  if (config.localGraphQLApi) {
    return 'http://localhost:4000/graphql-api/graphql';
  }
  return apiResourceUrl('/graphql-api/graphql');
})();

export const createApolloClient = (language = 'nb') => {
  const headersLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      'Accept-Language': language,
    },
  }));

  const cache = __CLIENT__
    ? new InMemoryCache().restore(window.DATA.apolloState)
    : new InMemoryCache();

  const client = new ApolloClient({
    link: ApolloLink.from([
      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            handleError(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
          );
        }
        if (networkError) {
          handleError(`[Network error]: ${networkError}`, {
            accessToken: getAccessToken(),
            expiresAt: getAccessTokenExpiresAt(),
            clientTime: new Date().getTime(),
          });
        }
      }),
      headersLink,
      new BatchHttpLink({
        uri,
        fetch: fetchWithAccessToken,
      }),
    ]),
    cache,
  });

  return client;
};
