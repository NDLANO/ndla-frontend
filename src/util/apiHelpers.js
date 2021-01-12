/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import defined from 'defined';
import { ApolloClient } from 'apollo-client';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
  defaultDataIdFromObject,
} from 'apollo-cache-inmemory';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
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

// See: https://www.apollographql.com/docs/react/advanced/fragments.html#fragment-matcher
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: 'TaxonomyEntity',
          possibleTypes: [{ name: 'Resource' }, { name: 'Topic' }],
        },
        {
          kind: 'INTERFACE',
          name: 'SearchResult',
          possibleTypes: [
            { name: 'ArticleSearchResult' },
            { name: 'LearningpathSearchResult' },
          ],
        },
      ],
    },
  },
});

const dataIdFromObject = object => {
  switch (object.__typename) {
    case 'SearchContext':
    case 'GroupSearchResult':
      if (object.filters?.length) {
        return object.filters.id;
      } else {
        return object.path;
      }
    case 'Filter':
      return `${object.id}+${object.relevanceId}`;
    case 'FrontpageSearchResult':
      return object.path;
    default:
      return defaultDataIdFromObject(object);
  }
};

export const createApolloClient = (language = 'nb') => {
  const headersLink = setContext(async (_, { headers }) => ({
    headers: {
      ...headers,
      'Accept-Language': language,
    },
  }));

  const cache = __CLIENT__
    ? new InMemoryCache({ fragmentMatcher, dataIdFromObject }).restore(
        window.DATA.apolloState,
      )
    : new InMemoryCache({ fragmentMatcher, dataIdFromObject });

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
