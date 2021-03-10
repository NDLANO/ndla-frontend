/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { BatchHttpLink } from '@apollo/client/link/batch-http';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import config from '../config';
import handleError from './handleError';
import { default as createFetch } from './fetch';

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

const typePolicies = {
  SearchContext: {
    keyFields: object =>
      object.filters?.length ? object.filters.id : object.path,
  },
  GroupSearchResult: {
    keyFields: object =>
      object.filters?.length ? object.filters.id : object.path,
  },
  Filter: {
    keyFields: object => `${object.id}+${object.relevanceId}`,
  },
  FrontpageSearchResult: {
    keyFields: ['path'],
  },
};

export const createApolloClient = (language = 'nb') => {
  const headersLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      'Accept-Language': language,
      'Use-Taxonomy2': true,
    },
  }));

  const cache = __CLIENT__
    ? new InMemoryCache({ possibleTypes, typePolicies }).restore(
        window.DATA.apolloState,
      )
    : new InMemoryCache({ possibleTypes, typePolicies });

  const client = new ApolloClient({
    ssrMode: true,
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
            clientTime: new Date().getTime(),
          });
        }
      }),
      headersLink,
      new BatchHttpLink({
        uri,
        fetch: createFetch,
      }),
    ]),
    cache,
  });

  return client;
};
