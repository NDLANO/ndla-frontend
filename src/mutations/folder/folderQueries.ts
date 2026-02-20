/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloCache, ErrorLike, gql } from "@apollo/client";
import { useApolloClient, useQuery } from "@apollo/client/react";
import {
  GQLFavouriteSubjectsQuery,
  GQLFavouriteSubjectsQueryVariables,
  GQLFolder,
  GQLMyNdlaResourceMetaQuery,
  GQLMyNdlaResourceMetaSearchInput,
  GQLMyNdlaResourceMetaSearchQuery,
  GQLFoldersPageQuery,
  GQLRecentlyUsedQuery,
  GQLSharedFolder,
  GQLSharedFolderQuery,
  GQLSharedFolderQueryVariables,
  GQLRootResourcesQuery,
  GQLRootResourcesQueryVariables,
  GQLResourceConnectionsQuery,
  GQLResourceConnectionsQueryVariables,
} from "../../graphqlTypes";
import {
  foldersPageQueryFragment,
  myNdlaResourceMetaFragment,
  sharedFoldersPageQueryFragment,
} from "./folderFragments";

const myNdlaResourceMetaQuery = gql`
  query myNdlaResourceMeta($resource: MyNdlaResourceMetaSearchInput!) {
    myNdlaResourceMeta(resource: $resource) {
      ...MyNdlaResourceMeta
    }
  }
  ${myNdlaResourceMetaFragment}
`;

export const useMyNdlaResourceMeta = (
  resource: GQLMyNdlaResourceMetaSearchInput,
  options?: useQuery.Options<GQLMyNdlaResourceMetaQuery>,
) => {
  const { data: { myNdlaResourceMeta } = {}, ...rest } = useQuery<GQLMyNdlaResourceMetaQuery>(myNdlaResourceMetaQuery, {
    variables: { resource },
    ...options,
  });

  return { meta: myNdlaResourceMeta, ...rest };
};

const myNdlaResourceMetaSearchQuery = gql`
  query myNdlaResourceMetaSearch($resources: [MyNdlaResourceMetaSearchInput!]!) {
    myNdlaResourceMetaSearch(resources: $resources) {
      ...MyNdlaResourceMeta
    }
  }

  ${myNdlaResourceMetaFragment}
`;

export const useMyNdlaResourceMetaSearch = (
  resources: GQLMyNdlaResourceMetaSearchInput[],
  options?: useQuery.Options<GQLMyNdlaResourceMetaSearchQuery>,
) => {
  const { data: { myNdlaResourceMetaSearch: data } = {}, ...rest } = useQuery<GQLMyNdlaResourceMetaSearchQuery>(
    myNdlaResourceMetaSearchQuery,
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

export const useRecentlyUsedResources = (skip?: boolean) => {
  return useQuery<GQLRecentlyUsedQuery>(recentlyUsedQuery, { skip });
};

export const rootResourcesQuery = gql`
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

export const useRootResources = (options?: useQuery.Options<GQLRootResourcesQuery, GQLRootResourcesQueryVariables>) => {
  return useQuery<GQLRootResourcesQuery, GQLRootResourcesQueryVariables>(rootResourcesQuery, options);
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

const resourceConnectionsQuery = gql`
  query resourceConnections($path: String!) {
    myNdlaResourceConnections(path: $path) {
      resourceId
      folderId
    }
  }
`;

export const useResourceConnections = (
  options: useQuery.Options<GQLResourceConnectionsQuery, GQLResourceConnectionsQueryVariables>,
) => {
  return useQuery<GQLResourceConnectionsQuery, GQLResourceConnectionsQueryVariables>(resourceConnectionsQuery, options);
};

export const useFavouriteSubjects = (
  ids: string[],
  options?: Omit<useQuery.Options<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>, "variables">,
) =>
  useQuery<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>(favouriteSubjects, {
    variables: { ids },
    ...options,
  });
