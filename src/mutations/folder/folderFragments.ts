/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

export const myNdlaResourceFragment = gql`
  fragment MyNdlaResource on MyNdlaResource {
    __typename
    resourceId
    id
    resourceType
    path
    created
    tags
  }
`;

const baseFolderFragment = gql`
  fragment BaseFolder on Folder {
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
      ...MyNdlaResource
    }
  }
`;

// GraphQL does not support recursion. As such, we just do
// an arbitrary number of nested queries that is above the
// maximum folder depth
export const folderFragment = gql`
  fragment Folder on Folder {
    __typename
    ...BaseFolder
    subfolders {
      ...BaseFolder
      subfolders {
        ...BaseFolder
        subfolders {
          ...BaseFolder
          subfolders {
            ...BaseFolder
            subfolders {
              ...BaseFolder
              subfolders {
                ...BaseFolder
                subfolders {
                  ...BaseFolder
                  subfolders {
                    ...BaseFolder
                    subfolders {
                      ...BaseFolder
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
  ${baseFolderFragment}
  ${myNdlaResourceFragment}
`;

const baseSharedFolderFragment = gql`
  fragment BaseSharedFolder on SharedFolder {
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
      ...MyNdlaResource
    }
  }
  ${myNdlaResourceFragment}
`;

export const sharedFolderFragment = gql`
  fragment SharedFolder on SharedFolder {
    __typename
    ...BaseSharedFolder
    subfolders {
      ...BaseSharedFolder
      subfolders {
        ...BaseSharedFolder
        subfolders {
          ...BaseSharedFolder
          subfolders {
            ...BaseSharedFolder
            subfolders {
              ...BaseSharedFolder
              subfolders {
                ...BaseSharedFolder
                subfolders {
                  ...BaseSharedFolder
                  subfolders {
                    ...BaseSharedFolder
                    subfolders {
                      ...BaseSharedFolder
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
  ${baseSharedFolderFragment}
`;

export const myNdlaResourceMetaFragment = gql`
  fragment MyNdlaResourceMeta on MyNdlaResourceMeta {
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
    ... on MyNdlaArticleResourceMeta {
      traits
    }
  }
`;
