/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  TypePolicies,
} from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import config from '../config';
import handleError from './handleError';
import { default as createFetch } from './fetch';
import { isAccessTokenValid, getAccessToken, renewAuth } from './authHelpers';

export const fetch = createFetch;

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

export function apiResourceUrl(path: string) {
  return apiBaseUrl + path;
}

export function createErrorPayload(status: number, message: string, json: any) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError<T>(
  res: Response,
): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve(undefined) : resolve(res.json());
    }
    return res
      .json()
      .then(json => {
        const payload = createErrorPayload(
          res.status,
          json.message ?? res.statusText,
          json,
        );
        reject(payload);
      })
      .catch(reject);
  });
}

const uri = (() => {
  if (config.localGraphQLApi) {
    return 'http://localhost:4000/graphql-api/graphql';
  }
  return apiResourceUrl('/graphql-api/graphql');
})();

const possibleTypes = {
  TaxonomyEntity: ['Resource', 'Topic'],
  SearchResult: ['ArticleSearchResult', 'LearningpathSearchResult'],
};

const typePolicies: TypePolicies = {
  SearchContext: {
    keyFields: ['path'],
  },
  GroupSearchResult: {
    keyFields: ['path'],
  },
  Filter: {
    keyFields: object => `${object.id}+${object.relevanceId}`,
  },
  FrontpageSearchResult: {
    keyFields: ['path'],
  },
};

export const createApolloClient = (language = 'nb') => {
  const cache = __CLIENT__
    ? new InMemoryCache({ possibleTypes, typePolicies }).restore(
        window.DATA.apolloState,
      )
    : new InMemoryCache({ possibleTypes, typePolicies });

  const client = new ApolloClient({
    ssrMode: true,
    link: createApolloLinks(language),
    cache,
  });

  return client;
};

export const createApolloLinks = (lang: string) => {
  const headersLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      'Accept-Language': lang,
      FeideAuthorization: `Bearer ${getAccessToken()}`,
    },
  }));
  return ApolloLink.from([
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
          clientTime: new Date(),
        });
      }
    }),
    headersLink,
    new BatchHttpLink({
      uri,
      fetch: createFetch,
    }),
  ]);
};

type HttpHeaders = {
  headers?: {
    'Content-Type': string;
  };
};

export const fetchAuthorized = (url: string, config?: HttpHeaders) =>
  fetchWithAuthorization(url, false, config);

export const fetchWithAuthorization = async (
  url: string,
  forceAuth: boolean,
  config?: HttpHeaders,
) => {
  if (forceAuth || !isAccessTokenValid()) {
    await renewAuth();
  }

  const contentType = config?.headers
    ? config?.headers['Content-Type']
    : 'text/plain';
  const extraHeaders = contentType ? { 'Content-Type': contentType } : {};
  const cacheControl = { 'Cache-Control': 'no-cache' };

  return fetch(url, {
    ...config,
    headers: {
      ...extraHeaders,
      ...cacheControl,
      FeideAuthorization: `Bearer ${getAccessToken()}`,
    },
  });
};
