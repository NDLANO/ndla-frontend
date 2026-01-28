/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, Reference } from "@apollo/client";
import { folderFragment, folderResourceFragment, foldersPageQueryFragment } from "./folderFragments";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  GQLAddFolderMutation,
  GQLAddResourceToFolderMutation,
  GQLCopySharedFolderMutation,
  GQLDeleteFolderMutation,
  GQLDeleteFolderResourceMutation,
  GQLFavoriteSharedFolderMutation,
  GQLFoldersPageQuery,
  GQLMutationAddFolderArgs,
  GQLMutationAddFolderResourceArgs,
  GQLMutationCopySharedFolderArgs,
  GQLMutationDeleteFolderArgs,
  GQLMutationDeleteFolderResourceArgs,
  GQLMutationFavoriteSharedFolderArgs,
  GQLMutationUnFavoriteSharedFolderArgs,
  GQLMutationUpdateFolderArgs,
  GQLMutationUpdateFolderResourceArgs,
  GQLMutationUpdateFolderStatusArgs,
  GQLUnFavoriteSharedFolderMutation,
  GQLUpdateFolderMutation,
  GQLUpdateFolderResourceMutation,
  GQLUpdateFolderStatusMutation,
} from "../../graphqlTypes";
import { foldersPageQuery, recentlyUsedQuery } from "./folderQueries";

const deleteFolderMutation = gql`
  mutation deleteFolder($id: String!) {
    deleteFolder(id: $id)
  }
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
      client.cache.evict({ id: normalizedId });
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

export const useFavoriteSharedFolder = () => {
  const client = useApolloClient();
  return useMutation<GQLFavoriteSharedFolderMutation, GQLMutationFavoriteSharedFolderArgs>(
    favoriteSharedFolderMutation,
    {
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
        client.cache.evict({ id: normalizedId });
        client.cache.gc();
      },
    },
  );
};
