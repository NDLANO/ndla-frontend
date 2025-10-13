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
  CombinedGraphQLErrors,
  FieldFunctionOptions,
  HttpLink,
  InMemoryCache,
  LocalStateError,
  ServerError,
  ServerParseError,
  TypePolicies,
  UnconventionalError,
} from "@apollo/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { ErrorLink } from "@apollo/client/link/error";
import { getFeideCookie, isAccessTokenValid } from "./authHelpers";
import {
  NDLAGraphQLError,
  ApolloNetworkError,
  ApolloLocalStateError,
  ApolloServerParseError,
  ApolloUnconventionalError,
} from "./error/NDLAApolloErrors";
import { StatusError } from "./error/StatusError";
import handleError from "./handleError";
import config from "../config";
import { GQLQueryFolderResourceMetaSearchArgs } from "../graphqlTypes";
import { NOT_FOUND } from "../statusCodes";

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

export function resolveJsonOrRejectWithError<T>(res: Response): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    if (res.ok) {
      return res.status === 204 ? resolve(undefined) : resolve(res.json());
    }
    return res
      .json()
      .then((json) => {
        const errorMessage = json.message ?? res.statusText;
        const msg = `Got error with message '${errorMessage}' and status ${res.status} when requesting '${res.url}'`;
        const payload = new StatusError(msg, res.status, json);
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

const possibleTypes = {
  TaxonomyEntity: ["Resource", "Topic"],
  SearchResult: ["ArticleSearchResult", "LearningpathSearchResult", "NodeSearchResult"],
  FolderResourceMeta: ["ArticleFolderResourceMeta", "LearningpathFolderResourceMeta"],
};

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      folderResourceMeta: {
        read(_, { args, toReference }) {
          return toReference(`FolderResourceMeta:${args!.resource.resourceType}${args!.resource.id}`);
        },
      },
      folderResourceMetaSearch: {
        //@ts-expect-error - We just want some autocomplete here
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
    keyFields: ["contextId"],
  },
  SearchResult: {
    keyFields: ["id", "__typename"],
  },
  Filter: {
    keyFields: (object) => `${object.id}+${object.relevanceId}`,
  },
  FrontpageMenu: {
    keyFields: ["articleId"],
  },
  TaxonomyContext: {
    keyFields: ["contextId"],
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
  const cache: InMemoryCache = new InMemoryCache({ possibleTypes, typePolicies });
  if (config.isClient) {
    cache.restore(window.DATA.apolloState);
  }

  return cache;
}

export const createApolloClient = (language = "nb", versionHash?: any) => {
  const cache = getCache();

  return new ApolloClient({
    link: createApolloLinks(language, versionHash),
    cache,
    ssrMode: !config.isClient,
    defaultOptions: {
      watchQuery: {
        errorPolicy: "all",
      },
      query: {
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
};

export const createApolloLinks = (lang: string, versionHash?: any) => {
  const cookieString = config.isClient ? document.cookie : "";
  const feideCookie = getFeideCookie(cookieString);
  const accessTokenValid = isAccessTokenValid(feideCookie);
  const accessToken = feideCookie?.access_token;
  const versionHeader: Record<string, string> = versionHash ? { versionHash: versionHash } : {};

  const headers = {
    "Accept-Language": lang,
    ...versionHeader,
    ...(accessToken && accessTokenValid ? { FeideAuthorization: `Bearer ${accessToken}` } : {}),
  };

  const errorLink = new ErrorLink(({ error, operation }) => {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach((err) => {
        if (err.extensions?.status !== NOT_FOUND) {
          handleError(new NDLAGraphQLError(err, operation));
        }
      });
    } else if (ServerError.is(error)) {
      handleError(new ApolloNetworkError(error, operation));
    } else if (LocalStateError.is(error)) {
      handleError(new ApolloLocalStateError(error, operation));
    } else if (ServerParseError.is(error)) {
      handleError(new ApolloServerParseError(error, operation));
    } else if (UnconventionalError.is(error)) {
      handleError(new ApolloUnconventionalError(error, operation));
      // This is either a CombinedProtocolError or a non-graphql error somehow. We don't need any special handling for any of them.
    } else {
      handleError(error);
    }
  });

  return ApolloLink.from([
    errorLink,
    typeof navigator !== "undefined" && navigator.webdriver
      ? new HttpLink({ uri, headers })
      : new BatchHttpLink({ uri, headers }),
  ]);
};
