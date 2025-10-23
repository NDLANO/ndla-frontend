/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloCache, ErrorLike, gql } from "@apollo/client";
import {
  GQLFavouriteSubjectsQuery,
  GQLFavouriteSubjectsQueryVariables,
  GQLFolder,
  GQLFolderResourceMetaQuery,
  GQLFolderResourceMetaSearchInput,
  GQLFolderResourceMetaSearchQuery,
  GQLFoldersPageQuery,
  GQLRecentlyUsedQuery,
  GQLSharedFolder,
  GQLSharedFolderQuery,
  GQLSharedFolderQueryVariables,
} from "../../graphqlTypes";
import {
  folderResourceMetaFragment,
  foldersPageQueryFragment,
  sharedFoldersPageQueryFragment,
} from "./folderFragments";
import { useApolloClient, useQuery } from "@apollo/client/react";

const folderResourceMetaQuery = gql`
  query folderResourceMeta($resource: FolderResourceMetaSearchInput!) {
    folderResourceMeta(resource: $resource) {
      ...FolderResourceMeta
    }
  }
  ${folderResourceMetaFragment}
`;

export const useFolderResourceMeta = (
  resource: GQLFolderResourceMetaSearchInput,
  options?: useQuery.Options<GQLFolderResourceMetaQuery>,
) => {
  const { data: { folderResourceMeta } = {}, ...rest } = useQuery<GQLFolderResourceMetaQuery>(folderResourceMetaQuery, {
    variables: { resource },
    ...options,
  });

  return { meta: folderResourceMeta, ...rest };
};

const folderResourceMetaSearchQuery = gql`
  query folderResourceMetaSearch($resources: [FolderResourceMetaSearchInput!]!) {
    folderResourceMetaSearch(resources: $resources) {
      ...FolderResourceMeta
    }
  }

  ${folderResourceMetaFragment}
`;

export const useFolderResourceMetaSearch = (
  resources: GQLFolderResourceMetaSearchInput[],
  options?: useQuery.Options<GQLFolderResourceMetaSearchQuery>,
) => {
  const { data: { folderResourceMetaSearch: data } = {}, ...rest } = useQuery<GQLFolderResourceMetaSearchQuery>(
    folderResourceMetaSearchQuery,
    {
      variables: { resources },
      ...options,
    },
  );

  return { data, ...rest };
};

export const foldersPageQuery = gql`
  query foldersPage {
    folders(includeSubfolders: true, includeResources: true) {
      folders {
        ...FoldersPageQueryFragment
      }
      sharedFolders {
        ...SharedFoldersPageQueryFragment
      }
    }
  }
  ${foldersPageQueryFragment}
  ${sharedFoldersPageQueryFragment}
`;

interface UseFolders {
  skip?: boolean;
}

export const useFolders = ({ skip }: UseFolders = {}): {
  folders: GQLFolder[];
  sharedFolders: GQLSharedFolder[];
  loading: boolean;
  error?: ErrorLike;
} => {
  const { data, loading, error } = useQuery<GQLFoldersPageQuery>(foldersPageQuery, {
    skip,
  });

  const folders = (data?.folders.folders ?? []) as GQLFolder[];
  const sharedFolders = (data?.folders.sharedFolders ?? []) as GQLSharedFolder[];
  return { folders, sharedFolders, loading, error };
};

export const getFolder = (cache: ApolloCache, folderId?: string, shared?: boolean): GQLFolder | null => {
  if (!folderId) return null;

  return cache.readFragment({
    fragmentName: shared ? "SharedFoldersPageQueryFragment" : "FoldersPageQueryFragment",
    fragment: shared ? sharedFoldersPageQueryFragment : foldersPageQueryFragment,
    id: cache.identify({
      __typename: shared ? "SharedFolder" : "Folder",
      id: folderId,
    }),
  });
};

export const useFolder = (folderId?: string): GQLFolder | null => {
  const { cache } = useApolloClient();
  return getFolder(cache, folderId);
};

export const useSharedFolder = (folderId?: string): GQLFolder | null => {
  const { cache } = useApolloClient();
  return getFolder(cache, folderId, true);
};

export const sharedFolderQuery = gql`
  query sharedFolder($id: String!) {
    sharedFolder(id: $id) {
      ...SharedFoldersPageQueryFragment
    }
  }
  ${sharedFoldersPageQueryFragment}
`;

interface UseSharedFolder {
  id: string;
}

export const useGetSharedFolder = ({
  id,
}: UseSharedFolder): {
  folder?: GQLFolder;
  loading: boolean;
  error?: ErrorLike;
} => {
  const { data, loading, error } = useQuery<GQLSharedFolderQuery, GQLSharedFolderQueryVariables>(sharedFolderQuery, {
    variables: { id },
  });

  const folder = data?.sharedFolder as GQLFolder | undefined;

  return { folder, loading, error };
};

export const recentlyUsedQuery = gql`
  query recentlyUsed {
    allFolderResources(size: 5) {
      id
      resourceId
      path
      tags
      resourceType
      created
    }
  }
`;

export const useRecentlyUsedResources = (skip?: boolean) => {
  return useQuery<GQLRecentlyUsedQuery>(recentlyUsedQuery, { skip });
};

const favouriteSubjects = gql`
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

export const useFavouriteSubjects = (
  ids: string[],
  options?: Omit<useQuery.Options<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>, "variables">,
) =>
  useQuery<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>(favouriteSubjects, {
    variables: { ids },
    ...options,
  });
