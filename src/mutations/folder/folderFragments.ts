/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

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

export const folderResourceMetaFragment = gql`
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
