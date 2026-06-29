/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloCache, ErrorLike, gql, TypedDocumentNode } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import {
  GQLFavouriteSubjectsQuery,
  GQLFavouriteSubjectsQueryVariables,
  GQLMyNdlaResourceMetaQuery,
  GQLMyNdlaResourceMetaSearchQuery,
  GQLFoldersPageQuery,
  GQLRecentlyUsedQuery,
  GQLSharedFolderFragment,
  GQLSharedFolderQuery,
  GQLSharedFolderQueryVariables,
  GQLRootResourcesQuery,
  GQLRootResourcesQueryVariables,
  GQLResourceConnectionsQuery,
  GQLResourceConnectionsQueryVariables,
  GQLFolderFragment,
  GQLFoldersPageQueryVariables,
  GQLMyNdlaResourceMetaSearchQueryVariables,
  GQLRecentlyUsedQueryVariables,
  GQLMyNdlaResourceMetaQueryVariables,
} from "../../graphqlTypes";
import { folderFragment, myNdlaResourceMetaFragment, sharedFolderFragment } from "./folderFragments";

export const myNdlaResourceMetaQuery: TypedDocumentNode<
  GQLMyNdlaResourceMetaQuery,
  GQLMyNdlaResourceMetaQueryVariables
> = gql`
  query myNdlaResourceMeta($resource: MyNdlaResourceMetaSearchInput!) {
    myNdlaResourceMeta(resource: $resource) {
      ...MyNdlaResourceMeta
    }
  }
  ${myNdlaResourceMetaFragment}
`;

export const myNdlaResourceMetaSearchQuery: TypedDocumentNode<
  GQLMyNdlaResourceMetaSearchQuery,
  GQLMyNdlaResourceMetaSearchQueryVariables
> = gql`
  query myNdlaResourceMetaSearch($resources: [MyNdlaResourceMetaSearchInput!]!) {
    myNdlaResourceMetaSearch(resources: $resources) {
      ...MyNdlaResourceMeta
    }
  }

  ${myNdlaResourceMetaFragment}
`;

export const foldersPageQuery: TypedDocumentNode<GQLFoldersPageQuery, GQLFoldersPageQueryVariables> = gql`
  query foldersPage {
    folders(includeSubfolders: true, includeResources: true) {
      folders {
        ...Folder
      }
      sharedFolders {
        ...SharedFolder
      }
    }
  }
  ${folderFragment}
  ${sharedFolderFragment}
`;

interface UseFolders {
  skip?: boolean;
}

export const useFolders = ({ skip }: UseFolders = {}): {
  folders: GQLFolderFragment[];
  sharedFolders: GQLSharedFolderFragment[];
  loading: boolean;
  error?: ErrorLike;
} => {
  const { data, loading, error } = useQuery(foldersPageQuery, {
    skip,
  });

  const folders = (data?.folders.folders ?? []) as GQLFolderFragment[];
  const sharedFolders = (data?.folders.sharedFolders ?? []) as GQLSharedFolderFragment[];
  return { folders, sharedFolders, loading, error };
};

export const getFolder = (cache: ApolloCache, folderId?: string, shared?: boolean): GQLFolderFragment | null => {
  if (!folderId) return null;

  return cache.readFragment({
    fragmentName: shared ? "SharedFolder" : "Folder",
    fragment: shared ? sharedFolderFragment : folderFragment,
    id: cache.identify({
      __typename: shared ? "SharedFolder" : "Folder",
      id: folderId,
    }),
  });
};

export const useFolder = (folderId?: string): GQLFolderFragment | null => {
  const { cache } = useApolloClient();
  return getFolder(cache, folderId);
};

export const useSharedFolder = (folderId?: string): GQLFolderFragment | null => {
  const { cache } = useApolloClient();
  return getFolder(cache, folderId, true);
};

export const sharedFolderQueryDef: TypedDocumentNode<GQLSharedFolderQuery, GQLSharedFolderQueryVariables> = gql`
  query sharedFolder($id: String!) {
    sharedFolder(id: $id) {
      ...SharedFolder
    }
  }
  ${sharedFolderFragment}
`;

export const recentlyUsedQuery: TypedDocumentNode<GQLRecentlyUsedQuery, GQLRecentlyUsedQueryVariables> = gql`
  query recentlyUsed {
    allMyNdlaResources(size: 5) {
      id
      resourceId
      path
      tags
      resourceType
      created
    }
  }
`;

export const rootResourcesQuery: TypedDocumentNode<GQLRootResourcesQuery, GQLRootResourcesQueryVariables> = gql`
  query rootResources {
    myNdlaRootResources {
      id
      resourceId
      path
      tags
      resourceType
      created
    }
  }
`;

export const favouriteSubjectsQueryDef: TypedDocumentNode<
  GQLFavouriteSubjectsQuery,
  GQLFavouriteSubjectsQueryVariables
> = gql`
  query favouriteSubjects($ids: [String!]!) {
    subjects: nodes(nodeType: "SUBJECT", ids: $ids) {
      id
      name
      url
      metadata {
        customFields
      }
    }
  }
`;

export const resourceConnectionsQuery: TypedDocumentNode<
  GQLResourceConnectionsQuery,
  GQLResourceConnectionsQueryVariables
> = gql`
  query resourceConnections($path: String!) {
    myNdlaResourceConnections(path: $path) {
      resourceId
      folderId
    }
  }
`;
