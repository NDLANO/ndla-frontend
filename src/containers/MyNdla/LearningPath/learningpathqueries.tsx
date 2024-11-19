/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";

const imageFragment = gql`
  fragment ImageFragment on ImageMetaInformation {
    id
    metaUrl
    title
    altText
    imageUrl
    size
    contentType
    copyright {
      license
    }
    tags
    caption
    supportedLanguages
    created
    createdBy
  }
`;

export const imageSearchQuery = gql`
  query imageSearch($query: String, $page: Int, $pageSize: Int) {
    imageSearch(query: $query, page: $page, pageSize: $pageSize) {
      ...ImageFragment
    }
  }
  ${imageFragment}
`;
