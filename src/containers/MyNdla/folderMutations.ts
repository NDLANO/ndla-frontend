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
} from '@apollo/client';
import {
  GQLAddFolderMutation,
  GQLAddResourceToFolderMutation,
  GQLCopySharedFolderMutation,
  GQLDeleteFolderMutation,
  GQLDeleteFolderResourceMutation,
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
  GQLMutationSortFoldersArgs,
  GQLMutationSortResourcesArgs,
  GQLMutationUpdateFolderArgs,
  GQLMutationUpdateFolderResourceArgs,
  GQLMutationUpdateFolderStatusArgs,
  GQLRecentlyUsedQuery,
  GQLSharedFolderQuery,
  GQLSharedFolderQueryVariables,
  GQLSortFoldersMutation,
  GQLUpdateFolderMutation,
  GQLUpdateFolderResourceMutation,
  GQLUpdateFolderStatusMutation,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

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
      ...FoldersPageQueryFragment
    }
  }
  ${foldersPageQueryFragment}
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
  query sharedFolder($id: String!, $includeSubfolders: Boolean, $includeResources: Boolean) {
    sharedFolder(id: $id, includeSubfolders: $includeSubfolders, includeResources: $includeResources) {
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
  const { data: { folderResourceMeta } = {}, ...rest } = useGraphQuery<GQLFolderResourceMetaQuery>(
    folderResourceMetaQuery,
    {
      variables: { resource },
      ...options,
    },
  );

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
  const { data: { folderResourceMetaSearch: data } = {}, ...rest } = useGraphQuery<GQLFolderResourceMetaSearchQuery>(
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
  loading: boolean;
} => {
  const { cache } = useApolloClient();
  const { data, loading } = useGraphQuery<GQLFoldersPageQuery>(foldersPageQuery, {
    skip,
    onCompleted: () => {
      cache.gc();
    },
  });

  const folders = (data?.folders ?? []) as GQLFolder[];
  return { folders, loading };
};

export const getFolder = (cache: ApolloCache<object>, folderId?: string, shared?: boolean): GQLFolder | null => {
  if (!folderId) return null;

  return cache.readFragment({
    fragmentName: shared ? 'SharedFoldersPageQueryFragment' : 'FoldersPageQueryFragment',
    fragment: shared ? sharedFoldersPageQueryFragment : foldersPageQueryFragment,
    id: cache.identify({
      __typename: shared ? 'SharedFolder' : 'Folder',
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
  includeResources?: boolean;
  includeSubfolders?: boolean;
}

export const useGetSharedFolder = ({
  id,
  includeResources,
  includeSubfolders,
}: UseSharedFolder): {
  folder?: GQLFolder;
  loading: boolean;
  error?: ApolloError;
} => {
  const { data, loading, error } = useGraphQuery<GQLSharedFolderQuery, GQLSharedFolderQueryVariables>(
    sharedFolderQuery,
    {
      variables: { id, includeResources, includeSubfolders },
    },
  );

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

export const useRecentlyUsedResources = () => {
  const { cache } = useApolloClient();
  const { data, ...rest } = useGraphQuery<GQLRecentlyUsedQuery>(recentlyUsedQuery, {
    onCompleted: () => {
      cache.gc();
    },
  });

  return { allFolderResources: data?.allFolderResources, ...rest };
};

export const useAddFolderMutation = () => {
  const client = useApolloClient();
  const [addFolder, { loading }] = useMutation<GQLAddFolderMutation, GQLMutationAddFolderArgs>(addFolderMutation, {
    onCompleted: ({ addFolder: newFolder }) => {
      const parentId = newFolder.parentId;
      if (!parentId) {
        client.cache.modify({
          fields: {
            folders: (existingFolders = []) =>
              existingFolders.concat({
                __ref: client.cache.identify(newFolder),
              }),
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

  return { addFolder, loading };
};

export const useDeleteFolderMutation = () => {
  const client = useApolloClient();
  const [deleteFolder, { loading }] = useMutation<GQLDeleteFolderMutation, GQLMutationDeleteFolderArgs>(
    deleteFolderMutation,
    {
      refetchQueries: () => {
        const beforeDeletion: GQLFoldersPageQuery | null = client.cache.readQuery({
          query: foldersPageQuery,
        });
        if (beforeDeletion?.folders?.length === 1) {
          return [{ query: recentlyUsedQuery }, { query: foldersPageQuery }];
        }
        return [{ query: recentlyUsedQuery }];
      },
      onCompleted: ({ deleteFolder: id }) => {
        const normalizedId = client.cache.identify({ id, __typename: 'Folder' });
        client.cache.evict({ id: normalizedId, broadcast: false });
        client.cache.gc();
      },
    },
  );
  return { deleteFolder, loading };
};

export const useUpdateFolderResourceMutation = () => {
  const [updateFolderResource, { loading }] = useMutation<
    GQLUpdateFolderResourceMutation,
    GQLMutationUpdateFolderResourceArgs
  >(updateFolderResourceMutation);

  return { updateFolderResource, loading };
};

export const useUpdateFolderStatusMutation = () => {
  const { cache } = useApolloClient();
  const [updateFolderStatus, { loading }] = useMutation<
    GQLUpdateFolderStatusMutation,
    GQLMutationUpdateFolderStatusArgs
  >(updateFolderStatusMutation, {
    onCompleted: (data, values) => {
      data?.updateFolderStatus.forEach((folderId) => {
        cache.modify({
          id: cache.identify({ id: folderId, __typename: 'Folder' }),
          fields: {
            status: () => {
              return values!.variables!.status;
            },
          },
        });
      });
    },
  });
  return { updateFolderStatus, loading };
};

export const useCopySharedFolderMutation = () => {
  const { cache } = useApolloClient();
  const [copySharedFolder, { loading, error }] = useMutation<
    GQLCopySharedFolderMutation,
    GQLMutationCopySharedFolderArgs
  >(copySharedFolderMutation, {
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
            folders: (existing = []) =>
              existing.concat({
                __ref: cache.identify(data.copySharedFolder),
              }),
          },
        });
      }
    },
  });

  return { copySharedFolder, loading, error };
};

export const useUpdateFolderMutation = () => {
  const { cache } = useApolloClient();
  const [updateFolder, { loading }] = useMutation<GQLUpdateFolderMutation, GQLMutationUpdateFolderArgs>(
    updateFolderMutation,
    {
      onCompleted(data, values) {
        cache.modify({
          id: cache.identify({
            id: data.updateFolder.id,
            __typename: 'SharedFolder',
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
    },
  );
  return { updateFolder, loading };
};

export const useSortFoldersMutation = () => {
  const [sortFolders] = useMutation<GQLSortFoldersMutation, GQLMutationSortFoldersArgs>(sortFoldersMutation);

  return { sortFolders };
};

export const useSortResourcesMutation = () => {
  const [sortResources] = useMutation<boolean, GQLMutationSortResourcesArgs>(sortResourcesMutation);

  return { sortResources };
};

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
  const [addResourceToFolder, { loading }] = useMutation<
    GQLAddResourceToFolderMutation,
    GQLMutationAddFolderResourceArgs
  >(addResourceToFolderQuery, {
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

  return { addResourceToFolder, loading };
};

const deleteFolderResourceMutation = gql`
  mutation deleteFolderResource($folderId: String!, $resourceId: String!) {
    deleteFolderResource(folderId: $folderId, resourceId: $resourceId)
  }
`;

export const useDeleteFolderResourceMutation = (folderId: string) => {
  const { cache } = useApolloClient();
  const [deleteFolderResource] = useMutation<GQLDeleteFolderResourceMutation, GQLMutationDeleteFolderResourceArgs>(
    deleteFolderResourceMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      onCompleted: ({ deleteFolderResource: id }) => {
        cache.modify({
          id: cache.identify({ __typename: 'Folder', id: folderId }),
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
  return { deleteFolderResource };
};
