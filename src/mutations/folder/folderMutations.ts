/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, Reference } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import {
  GQLAddFolderMutation,
  GQLCopySharedFolderMutation,
  GQLDeleteFolderMutation,
  GQLDeleteMyNdlaResourceMutation,
  GQLFavoriteSharedFolderMutation,
  GQLMutationAddFolderArgs,
  GQLMutationCopySharedFolderArgs,
  GQLMutationDeleteFolderArgs,
  GQLMutationDeleteMyNdlaResourceArgs,
  GQLMutationFavoriteSharedFolderArgs,
  GQLMutationUnFavoriteSharedFolderArgs,
  GQLMutationUpdateFolderArgs,
  GQLMutationUpdateMyNdlaResourceArgs,
  GQLMutationUpdateFolderStatusArgs,
  GQLUnFavoriteSharedFolderMutation,
  GQLUpdateFolderMutation,
  GQLUpdateMyNdlaResourceMutation,
  GQLUpdateFolderStatusMutation,
  GQLAddMyNdlaResourceMutation,
  GQLAddMyNdlaResourceMutationVariables,
} from "../../graphqlTypes";
import { folderFragment, myNdlaResourceFragment, foldersPageQueryFragment } from "./folderFragments";
import { recentlyUsedQuery } from "./folderQueries";

const deleteFolderMutation = gql`
  mutation deleteFolder($id: String!) {
    deleteFolder(id: $id)
  }
`;

const updateMyNdlaResourceMutation = gql`
  mutation updateMyNdlaResource($id: String!, $tags: [String!]!) {
    updateMyNdlaResource(id: $id, tags: $tags) {
      ...MyNdlaResourceFragment
    }
  }
  ${myNdlaResourceFragment}
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
  return useMutation<GQLDeleteFolderMutation, GQLMutationDeleteFolderArgs>(deleteFolderMutation, {
    refetchQueries: [{ query: recentlyUsedQuery }],
    update: (cache, { data }) => {
      cache.modify({
        fields: {
          folders(existingFolders, { readField }) {
            return {
              folders: existingFolders.folders.filter((r: any) => readField("id", r) !== data?.deleteFolder),
              sharedFolders: existingFolders.sharedFolders.filter(
                (r: any) => readField("id", r) !== data?.deleteFolder,
              ),
            };
          },
        },
      });
    },
  });
};

export const useUpdateMyNdlaResourceMutation = () =>
  useMutation<GQLUpdateMyNdlaResourceMutation, GQLMutationUpdateMyNdlaResourceArgs>(updateMyNdlaResourceMutation);

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

const addMyNdlaResourceQuery = gql`
  mutation addMyNdlaResource(
    $resourceId: String!
    $folderId: String
    $resourceType: String!
    $path: String!
    $tags: [String!]
  ) {
    addMyNdlaResource(
      resourceId: $resourceId
      folderId: $folderId
      resourceType: $resourceType
      path: $path
      tags: $tags
    ) {
      ...MyNdlaResourceFragment
    }
  }
  ${myNdlaResourceFragment}
`;

export const useAddMyNdlaResourceMutation = (folderId?: string) => {
  const { cache } = useApolloClient();
  return useMutation<GQLAddMyNdlaResourceMutation, GQLAddMyNdlaResourceMutationVariables>(addMyNdlaResourceQuery, {
    refetchQueries: [{ query: recentlyUsedQuery }],
    onCompleted: (data) => {
      if (folderId) {
        cache.modify({
          id: cache.identify({
            __ref: `Folder:${folderId}`,
          }),
          fields: {
            resources(existingResources = []) {
              return existingResources.concat({
                __ref: cache.identify(data.addMyNdlaResource),
              });
            },
          },
        });
      } else {
        cache.modify({
          fields: {
            myNdlaRootResources(existingResources = []) {
              return existingResources.concat({ __ref: cache.identify(data.addMyNdlaResource) });
            },
          },
        });
      }
    },
  });
};

const deleteMyNdlaResourceMutation = gql`
  mutation deleteMyNdlaResource($folderId: String, $resourceId: String!) {
    deleteMyNdlaResource(folderId: $folderId, resourceId: $resourceId)
  }
`;

export const useDeleteMyNdlaResourceMutation = (folderId: string | undefined) => {
  const { cache } = useApolloClient();
  return useMutation<GQLDeleteMyNdlaResourceMutation, GQLMutationDeleteMyNdlaResourceArgs>(
    deleteMyNdlaResourceMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      onCompleted: ({ deleteMyNdlaResource: id }) => {
        if (folderId) {
          cache.modify({
            id: cache.identify({ __typename: "Folder", id: folderId }),
            fields: {
              resources(existing = []) {
                return existing.filter((res: Reference) => res.__ref !== `MyNdlaResource:${id}`);
              },
            },
          });
        } else {
          cache.modify({
            fields: {
              myNdlaRootResources(existing = []) {
                return existing.filter((res: Reference) => res.__ref !== `MyNdlaResource:${id}`);
              },
            },
          });
        }
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
  return useMutation<GQLFavoriteSharedFolderMutation, GQLMutationFavoriteSharedFolderArgs>(
    favoriteSharedFolderMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      update: (cache, { data }) => {
        cache.modify({
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
                  __ref: cache.identify({ id: data?.favoriteSharedFolder, __typename: "SharedFolder" }),
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
  return useMutation<GQLUnFavoriteSharedFolderMutation, GQLMutationUnFavoriteSharedFolderArgs>(
    unFavoriteSharedFolderMutation,
    {
      refetchQueries: [{ query: recentlyUsedQuery }],
      update: (cache, { data }) => {
        cache.modify({
          fields: {
            folders(folders, { readField }) {
              return {
                folders: folders.folders,
                sharedFolders: folders.sharedFolders.filter(
                  (f: Reference) => readField("id", f) !== data?.unFavoriteSharedFolder,
                ),
              };
            },
          },
        });
      },
    },
  );
};
