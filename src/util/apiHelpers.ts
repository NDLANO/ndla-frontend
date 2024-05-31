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
  FieldFunctionOptions,
  InMemoryCache,
  TypePolicies,
  createHttpLink,
} from "@apollo/client/core";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getAccessToken, getFeideCookie, isAccessTokenValid, renewAuth } from "./authHelpers";
import handleError from "./handleError";
import config from "../config";
import { GQLBucketResult, GQLGroupSearch, GQLQueryFolderResourceMetaSearchArgs } from "../graphqlTypes";

const apiBaseUrl = (() => {
  if (config.runtimeType === "test") {
    return "http://ndla-api";
  }

  const NDLA_API_URL = !config.isClient ? config.ndlaApiUrl : window.DATA.config.ndlaApiUrl;

  return NDLA_API_URL;
})();

export { apiBaseUrl };

export function apiResourceUrl(path: string) {
  return apiBaseUrl + path;
}

export function createErrorPayload(status: number, message: string, json: any) {
  return Object.assign(new Error(message), { status, json });
}

export function resolveJsonOrRejectWithError<T>(res: Response): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve(undefined) : resolve(res.json());
    }
    return res
      .json()
      .then((json) => {
        const payload = createErrorPayload(res.status, json.message ?? res.statusText, json);
        reject(payload);
      })
      .catch(reject);
  });
}

const uri = (() => {
  if (config.localGraphQLApi) {
    return "http://localhost:4000/graphql-api/graphql";
  }
  return apiResourceUrl("/graphql-api/graphql");
})();

const getParentType = (type: string, aggregations?: GQLBucketResult[]) => {
  if (!aggregations) return undefined;
  const typeValue = aggregations.find((agg) => agg.value === type);
  return aggregations.find((agg) => agg.count === typeValue?.count && agg.value !== type)?.value;
};

const mergeGroupSearch = (existing: GQLGroupSearch[], incoming: GQLGroupSearch[], page: number) => {
  if (!existing) return incoming;
  return existing.map((group) => {
    const searchResults = incoming.filter((result) => {
      if (group.resourceType === result.resourceType) {
        return true;
      } else if (result.resourceType === "topic-article") {
        return false;
      } else return group.resourceType === getParentType(result.resourceType, result.aggregations?.[0]?.values);
    });
    if (searchResults.length) {
      const result = searchResults.reduce((accumulator, currentValue) => ({
        ...currentValue,
        resources: [...currentValue.resources, ...accumulator.resources],
        totalCount: currentValue.totalCount + accumulator.totalCount,
      }));
      return {
        ...group,
        resources: page === 1 ? result.resources : [...group.resources, ...result.resources],
        totalCount: result.totalCount,
      };
    }
    return group;
  });
};

const possibleTypes = {
  TaxonomyEntity: ["Resource", "Topic"],
  SearchResult: ["ArticleSearchResult", "LearningpathSearchResult"],
  FolderResourceMeta: ["ArticleFolderResourceMeta", "LearningpathFolderResourceMeta"],
};

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      groupSearch: {
        keyArgs: ["query", "subjects", "grepCodes"],
        merge(existing, incoming, { args }) {
          return mergeGroupSearch(existing, incoming, args?.page);
        },
      },
      folderResourceMeta: {
        read(_, { args, toReference }) {
          return toReference(`FolderResourceMeta:${args!.resource.resourceType}${args!.resource.id}`);
        },
      },
      folderResourceMetaSearch: {
        //@ts-ignore
        read(_, { args, toReference, canRead }: FieldFunctionOptions<GQLQueryFolderResourceMetaSearchArgs>) {
          const refs = args?.resources.map((arg) =>
            toReference(
              `${arg.resourceType === "learningpath" ? "Learningpath" : "Article"}FolderResourceMeta:${
                arg.resourceType
              }${arg.id}`,
            ),
          );

          if (refs && refs.every((ref) => canRead(ref))) {
            return refs;
          }
          return undefined;
        },
      },
    },
  },
  Folder: {
    fields: {
      subfolders: {
        merge(existing, incoming) {
          return existing ? existing : incoming;
        },
      },
      resources: {
        merge(existing, incoming) {
          return existing ? existing : incoming;
        },
      },
    },
  },
  SubjectPage: {
    fields: {
      about: {
        merge(existing, incoming) {
          return existing ? existing : incoming;
        },
      },
    },
  },
  SearchContext: {
    keyFields: ["path"],
  },
  GroupSearchResult: {
    keyFields: ["path"],
  },
  Filter: {
    keyFields: (object) => `${object.id}+${object.relevanceId}`,
  },
  FrontpageMenu: {
    keyFields: ["articleId"],
  },
  FrontpageSearchResult: {
    keyFields: ["path"],
  },
  FolderResourceMeta: {
    keyFields: (obj) => `${obj.__typename}:${obj.type}${obj.id}`,
  },
  ConfigMetaBoolean: {
    keyFields: ["key"],
  },
  ConfigMetaStringList: {
    keyFields: ["key"],
  },
  ArenaTopic: {
    fields: {
      isFollowing: {
        merge: (existing, incoming) => {
          return incoming != null ? incoming : existing;
        },
      },
    },
  },
};

function getCache() {
  const cache = new InMemoryCache({ possibleTypes, typePolicies });
  if (config.isClient) {
    cache.restore(window.DATA.apolloState);
  }

  return cache;
}

export const createApolloClient = (language = "nb", versionHash?: string) => {
  const cache = getCache();

  return new ApolloClient({
    link: createApolloLinks(language, versionHash),
    cache,
  });
};

export const createApolloLinks = (lang: string, versionHash?: string) => {
  const cookieString = config.isClient ? document.cookie : "";
  const feideCookie = getFeideCookie(cookieString);
  const accessTokenValid = isAccessTokenValid(feideCookie);
  const accessToken = feideCookie?.access_token;
  const versionHeader = versionHash ? { versionHash: versionHash } : {};

  const headersLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        "Accept-Language": lang,
        ...versionHeader,
        ...(accessToken && accessTokenValid ? { FeideAuthorization: `Bearer ${accessToken}` } : {}),
      },
    };
  });
  return ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          if (!config.isClient || extensions?.status !== 404) {
            handleError(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
          }
        });
      }
      if (networkError) {
        handleError(`[Network error]: ${networkError}`, {
          clientTime: new Date(),
        });
      }
    }),
    headersLink,
    !config.isE2E
      ? new BatchHttpLink({
          uri,
        })
      : createHttpLink({ uri }),
  ]);
};

type HttpHeaders = {
  headers?: {
    "Content-Type": string;
  };
};

export const fetchAuthorized = (url: string, config?: HttpHeaders) => fetchWithAuthorization(url, false, config);

export const fetchWithAuthorization = async (url: string, forceAuth: boolean, config?: HttpHeaders) => {
  if (forceAuth || !isAccessTokenValid()) {
    await renewAuth();
  }

  const contentType = config?.headers ? config?.headers["Content-Type"] : "text/plain";
  const extraHeaders: HeadersInit = contentType ? { "Content-Type": contentType } : {};
  const cacheControl: HeadersInit = { "Cache-Control": "no-cache" };

  return fetch(url, {
    ...config,
    headers: {
      ...extraHeaders,
      ...cacheControl,
      FeideAuthorization: `Bearer ${getAccessToken(document.cookie)}`,
    },
  });
};
