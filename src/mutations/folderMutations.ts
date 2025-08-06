/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ApolloCache,
  ApolloError,
  gql,
  QueryHookOptions,
  Reference,
  useApolloClient,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  GQLAddFolderMutation,
  GQLAddResourceToFolderMutation,
  GQLCopySharedFolderMutation,
  GQLDeleteFolderMutation,
  GQLDeleteFolderResourceMutation,
  GQLFavoriteSharedFolderMutation,
  GQLFavouriteSubjectsQuery,
  GQLFavouriteSubjectsQueryVariables,
  GQLFolder,
  GQLFolderResourceMetaQuery,
  GQLFolderResourceMetaSearchInput,
  GQLFolderResourceMetaSearchQuery,
  GQLFoldersPageQuery,
  GQLMutationAddFolderArgs,
  GQLMutationAddFolderResourceArgs,
  GQLMutationCopySharedFolderArgs,
  GQLMutationDeleteFolderArgs,
  GQLMutationDeleteFolderResourceArgs,
  GQLMutationFavoriteSharedFolderArgs,
  GQLMutationSortFoldersArgs,
  GQLMutationSortResourcesArgs,
  GQLMutationUnFavoriteSharedFolderArgs,
  GQLMutationUpdateFolderArgs,
  GQLMutationUpdateFolderResourceArgs,
  GQLMutationUpdateFolderStatusArgs,
  GQLRecentlyUsedQuery,
  GQLSharedFolder,
  GQLSharedFolderQuery,
  GQLSharedFolderQueryVariables,
  GQLSortFoldersMutation,
  GQLUnFavoriteSharedFolderMutation,
  GQLUpdateFolderMutation,
  GQLUpdateFolderResourceMutation,
  GQLUpdateFolderStatusMutation,
} from "../graphqlTypes";
import { nodeWithMetadataFragment } from "../queries";

export const folderResourceFragment = gql`
  fragment FolderResourceFragment on FolderResource {
    __typename
    resourceId
    id
    resourceType
    path
    created
    tags
  }
`;

export const folderFragment = gql`
  fragment FolderFragment on Folder {
    __typename
    id
    name
    status
    parentId
    created
    updated
    description
    breadcrumbs {
      __typename
      id
      name
    }
    owner {
      __typename
      name
    }
    resources {
      ...FolderResourceFragment
    }
  }
  ${folderResourceFragment}
`;

export const sharedFolderFragment = gql`
  fragment SharedFolderFragment on SharedFolder {
    __typename
    id
    name
    status
    parentId
    created
    updated
    description
    breadcrumbs {
      __typename
      id
      name
    }
    owner {
      __typename
      name
    }
    resources {
      ...FolderResourceFragment
    }
  }
  ${folderResourceFragment}
`;

const deleteFolderMutation = gql`
  mutation deleteFolder($id: String!) {
    deleteFolder(id: $id)
  }
`;

// GraphQL does not support recursion. As such, we just do
// an arbitrary number of nested queries that is above the
// maximum folder depth
export const foldersPageQueryFragment = gql`
  fragment FoldersPageQueryFragment on Folder {
    ...FolderFragment
    subfolders {
      ...FolderFragment
      subfolders {
        ...FolderFragment
        subfolders {
          ...FolderFragment
          subfolders {
            ...FolderFragment
            subfolders {
              ...FolderFragment
              subfolders {
                ...FolderFragment
                subfolders {
                  ...FolderFragment
                  subfolders {
                    ...FolderFragment
                    subfolders {
                      ...FolderFragment
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${folderFragment}
`;

export const sharedFoldersPageQueryFragment = gql`
  fragment SharedFoldersPageQueryFragment on SharedFolder {
    ...SharedFolderFragment
    subfolders {
      ...SharedFolderFragment
      subfolders {
        ...SharedFolderFragment
        subfolders {
          ...SharedFolderFragment
          subfolders {
            ...SharedFolderFragment
            subfolders {
              ...SharedFolderFragment
              subfolders {
                ...SharedFolderFragment
                subfolders {
                  ...SharedFolderFragment
                  subfolders {
                    ...SharedFolderFragment
                    subfolders {
                      ...SharedFolderFragment
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${sharedFolderFragment}
`;

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

const updateFolderResourceMutation = gql`
  mutation updateFolderResource($id: String!, $tags: [String!]!) {
    updateFolderResource(id: $id, tags: $tags) {
      ...FolderResourceFragment
    }
  }
  ${folderResourceFragment}
`;

const addFolderMutation = gql`
  mutation addFolder($name: String!, $parentId: String, $status: String, $description: String) {
    addFolder(name: $name, parentId: $parentId, status: $status, description: $description) {
      ...FoldersPageQueryFragment
    }
  }
  ${foldersPageQueryFragment}
`;

const updateFolderMutation = gql`
  mutation updateFolder($id: String!, $name: String, $status: String, $description: String) {
    updateFolder(id: $id, name: $name, status: $status, description: $description) {
      ...FoldersPageQueryFragment
    }
  }
  ${foldersPageQueryFragment}
`;

const sortFoldersMutation = gql`
  mutation sortFolders($parentId: String, $sortedIds: [String!]!) {
    sortFolders(parentId: $parentId, sortedIds: $sortedIds) {
      parentId
      sortedIds
    }
  }
`;

const sortSavedSharedFoldersMutation = gql`
  mutation sortSavedSharedFolders($sortedIds: [String!]!) {
    sortSavedSharedFolders(sortedIds: $sortedIds) {
      sortedIds
    }
  }
`;

const sortResourcesMutation = gql`
  mutation sortResources($parentId: String!, $sortedIds: [String!]!) {
    sortResources(parentId: $parentId, sortedIds: $sortedIds) {
      parentId
      sortedIds
    }
  }
`;

const updateFolderStatusMutation = gql`
  mutation updateFolderStatus($folderId: String!, $status: String!) {
    updateFolderStatus(folderId: $folderId, status: $status)
  }
`;

const copySharedFolderMutation = gql`
  mutation copySharedFolder($folderId: String!, $destinationFolderId: String) {
    copySharedFolder(folderId: $folderId, destinationFolderId: $destinationFolderId) {
      ...FolderFragment
      subfolders {
        ...FoldersPageQueryFragment
      }
    }
  }
  ${folderFragment}
  ${foldersPageQueryFragment}
`;

const folderResourceMetaFragment = gql`
  fragment FolderResourceMeta on FolderResourceMeta {
    __typename
    id
    title
    description
    type
    metaImage {
      url
      alt
    }
    resourceTypes {
      id
      name
    }
  }
`;

export const sharedFolderQuery = gql`
  query sharedFolder($id: String!) {
    sharedFolder(id: $id) {
      ...SharedFoldersPageQueryFragment
    }
  }
  ${sharedFoldersPageQueryFragment}
`;

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
  options?: QueryHookOptions<GQLFolderResourceMetaQuery>,
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
  options?: QueryHookOptions<GQLFolderResourceMetaSearchQuery>,
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

interface UseFolders {
  skip?: boolean;
}

export const useFolders = ({ skip }: UseFolders = {}): {
  folders: GQLFolder[];
  sharedFolders: GQLSharedFolder[];
  loading: boolean;
  error?: ApolloError;
} => {
  const { cache } = useApolloClient();
  const { data, loading, error } = useQuery<GQLFoldersPageQuery>(foldersPageQuery, {
    skip,
    onCompleted: () => {
      cache.gc();
    },
  });

  const folders = (data?.folders.folders ?? []) as GQLFolder[];
  const sharedFolders = (data?.folders.sharedFolders ?? []) as GQLSharedFolder[];
  return { folders, sharedFolders, loading, error };
};

export const getFolder = (cache: ApolloCache<object>, folderId?: string, shared?: boolean): GQLFolder | null => {
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

interface UseSharedFolder {
  id: string;
}

export const useGetSharedFolder = ({
  id,
}: UseSharedFolder): {
  folder?: GQLFolder;
  loading: boolean;
  error?: ApolloError;
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
  const { cache } = useApolloClient();
  return useQuery<GQLRecentlyUsedQuery>(recentlyUsedQuery, {
    onCompleted: () => {
      cache.gc();
    },
    skip: skip,
  });
};

export const favouriteSubjects = gql`
  query favouriteSubjects($ids: [String!]!) {
    subjects: nodes(nodeType: "SUBJECT", ids: $ids) {
      ...NodeWithMetadata
    }
  }
  ${nodeWithMetadataFragment}
`;

export const useFavouriteSubjects = (
  ids: string[],
  options?: Omit<QueryHookOptions<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>, "variables">,
) =>
  useQuery<GQLFavouriteSubjectsQuery, GQLFavouriteSubjectsQueryVariables>(favouriteSubjects, {
    variables: { ids },
    ...options,
  });

export const useAddFolderMutation = () => {
  const client = useApolloClient();
  return useMutation<GQLAddFolderMutation, GQLMutationAddFolderArgs>(addFolderMutation, {
    onCompleted: ({ addFolder: newFolder }) => {
      const parentId = newFolder.parentId;
      if (!parentId) {
        client.cache.modify({
          fields: {
            folders: (
              { folders: existingFolders, ...rest } = { folders: [], sharedFolders: [], __typename: "UserFolder" },
            ) => {
              return {
                folders: existingFolders.concat({
                  __ref: client.cache.identify(newFolder),
                }),
                ...rest,
              };
            },
          },
        });
      } else {
        client.cache.modify({
          id: client.cache.identify({
            __ref: `Folder:${newFolder.parentId}`,
          }),
          fields: {
            subfolders: (existingSubFolders = []) =>
              existingSubFolders.concat({
                __ref: client.cache.identify(newFolder),
              }),
          },
        });
      }
    },
  });
};

export const useDeleteFolderMutation = () => {
  const client = useApolloClient();
  return useMutation<GQLDeleteFolderMutation, GQLMutationDeleteFolderArgs>(deleteFolderMutation, {
    refetchQueries: () => {
      const beforeDeletion: GQLFoldersPageQuery | null = client.cache.readQuery({
        query: foldersPageQuery,
      });
      if (beforeDeletion?.folders.folders?.length === 1) {
        return [{ query: recentlyUsedQuery }, { query: foldersPageQuery }];
      }
      return [{ query: recentlyUsedQuery }];
    },
    onCompleted: ({ deleteFolder: id }) => {
      const normalizedId = client.cache.identify({ id, __typename: "Folder" });
      client.cache.evict({ id: normalizedId, broadcast: false });
      client.cache.gc();
    },
  });
};

export const useUpdateFolderResourceMutation = () =>
  useMutation<GQLUpdateFolderResourceMutation, GQLMutationUpdateFolderResourceArgs>(updateFolderResourceMutation);

export const useUpdateFolderStatusMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLUpdateFolderStatusMutation, GQLMutationUpdateFolderStatusArgs>(updateFolderStatusMutation, {
    onCompleted: (data, values) => {
      data?.updateFolderStatus.forEach((folderId) => {
        cache.modify({
          id: cache.identify({ id: folderId, __typename: "Folder" }),
          fields: {
            status: () => {
              return values!.variables!.status;
            },
          },
        });
      });
    },
  });
};

export const useCopySharedFolderMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLCopySharedFolderMutation, GQLMutationCopySharedFolderArgs>(copySharedFolderMutation, {
    onCompleted: (data, values) => {
      if (values?.variables?.destinationFolderId) {
        cache.modify({
          id: cache.identify({
            __ref: `Folder:${values.variables.destinationFolderId}`,
          }),
          fields: {
            subfolders: (existing = []) => {
              return existing.concat({
                __ref: cache.identify(data.copySharedFolder),
              });
            },
          },
        });
      } else {
        cache.modify({
          fields: {
            folders: (
              { folders: existing, ...rest } = {
                folders: [],
                sharedFolders: [],
                __typename: "UserFolder",
              },
            ) => {
              return {
                folders: existing.concat({
                  __ref: cache.identify(data.copySharedFolder),
                }),
                ...rest,
              };
            },
          },
        });
      }
    },
  });
};

export const useUpdateFolderMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLUpdateFolderMutation, GQLMutationUpdateFolderArgs>(updateFolderMutation, {
    onCompleted(data, values) {
      cache.modify({
        id: cache.identify({
          id: data.updateFolder.id,
          __typename: "SharedFolder",
        }),
        fields: {
          name: () => {
            return values!.variables!.name;
          },
          description: () => {
            return values!.variables!.description;
          },
        },
      });
    },
  });
};

export const useSortFoldersMutation = (options?: { type: "sharedFolder" | "folder" }) => {
  const mutation = options?.type === "sharedFolder" ? sortSavedSharedFoldersMutation : sortFoldersMutation;
  return useMutation<GQLSortFoldersMutation, GQLMutationSortFoldersArgs>(mutation);
};

export const useSortResourcesMutation = () => useMutation<boolean, GQLMutationSortResourcesArgs>(sortResourcesMutation);

const addResourceToFolderQuery = gql`
  mutation addResourceToFolder(
    $resourceId: String!
    $folderId: String!
    $resourceType: String!
    $path: String!
    $tags: [String!]
  ) {
    addFolderResource(
      resourceId: $resourceId
      folderId: $folderId
      resourceType: $resourceType
      path: $path
      tags: $tags
    ) {
      ...FolderResourceFragment
    }
  }
  ${folderResourceFragment}
`;

export const useAddResourceToFolderMutation = (folderId: string) => {
  const { cache } = useApolloClient();
  return useMutation<GQLAddResourceToFolderMutation, GQLMutationAddFolderResourceArgs>(addResourceToFolderQuery, {
    refetchQueries: [{ query: recentlyUsedQuery }],
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __ref: `Folder:${folderId}`,
        }),
        fields: {
          resources(existingResources = []) {
            return existingResources.concat({
              __ref: cache.identify(data.addFolderResource),
            });
          },
        },
      });
    },
  });
};

const deleteFolderResourceMutation = gql`
  mutation deleteFolderResource($folderId: String!, $resourceId: String!) {
    deleteFolderResource(folderId: $folderId, resourceId: $resourceId)
  }
`;

export const useDeleteFolderResourceMutation = (folderId: string) => {
  const { cache } = useApolloClient();
  return useMutation<GQLDeleteFolderResourceMutation, GQLMutationDeleteFolderResourceArgs>(
    deleteFolderResourceMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      onCompleted: ({ deleteFolderResource: id }) => {
        cache.modify({
          id: cache.identify({ __typename: "Folder", id: folderId }),
          fields: {
            resources(existing = []) {
              return existing.filter((res: Reference) => res.__ref !== `FolderResource:${id}`);
            },
          },
        });
        cache.gc();
      },
    },
  );
};

const favoriteSharedFolderMutation = gql`
  mutation favoriteSharedFolder($folderId: String!) {
    favoriteSharedFolder(folderId: $folderId)
  }
`;

export const useFavoriteSharedFolder = (folderId: string) => {
  const client = useApolloClient();
  return useMutation<GQLFavoriteSharedFolderMutation, GQLMutationFavoriteSharedFolderArgs>(
    favoriteSharedFolderMutation,
    {
      variables: { folderId },
      refetchQueries: [{ query: recentlyUsedQuery }],
      onCompleted: ({ favoriteSharedFolder: folderId }) => {
        client.cache.modify({
          fields: {
            folders: (
              { sharedFolders: existingFolders, ...rest } = {
                folders: [],
                sharedFolders: [],
                __typename: "UserFolder",
              },
            ) => {
              return {
                sharedFolders: existingFolders.concat({
                  __ref: client.cache.identify({ id: folderId, __typename: "SharedFolder" }),
                }),
                ...rest,
              };
            },
          },
        });
      },
    },
  );
};

const unFavoriteSharedFolderMutation = gql`
  mutation unFavoriteSharedFolder($folderId: String!) {
    unFavoriteSharedFolder(folderId: $folderId)
  }
`;

export const useUnFavoriteSharedFolder = () => {
  const client = useApolloClient();
  return useMutation<GQLUnFavoriteSharedFolderMutation, GQLMutationUnFavoriteSharedFolderArgs>(
    unFavoriteSharedFolderMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      onCompleted: ({ unFavoriteSharedFolder: id }) => {
        const normalizedId = client.cache.identify({
          id,
          __typename: "SharedFolder",
        });
        client.cache.evict({ id: normalizedId, broadcast: false });
        client.cache.gc();
      },
    },
  );
};
