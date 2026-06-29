/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, TypedDocumentNode } from "@apollo/client";
import {
  GQLImageSearchQuery,
  GQLFetchImageQuery,
  GQLFetchImageQueryVariables,
  GQLImageSearchQueryVariables,
} from "../../graphqlTypes";

const imageFragment = gql`
  fragment Image on ImageMetaInformationV3 {
    id
    metaUrl
    inactive
    title {
      title
      language
    }
    alttext {
      alttext
      language
    }
    copyright {
      origin
      processed
      license {
        license
        url
        description
      }
      creators {
        type
        name
      }
      processors {
        type
        name
      }
      rightsholders {
        type
        name
      }
    }
    tags {
      tags
      language
    }
    caption {
      caption
      language
    }
    supportedLanguages
    created
    createdBy
    modelRelease
    editorNotes {
      timestamp
      updatedBy
      note
    }
    image {
      fileName
      size
      contentType
      imageUrl
      variants {
        variantUrl
        size
      }
      dimensions {
        width
        height
      }
      language
    }
  }
`;

export const imagesSearchQuery: TypedDocumentNode<GQLImageSearchQuery, GQLImageSearchQueryVariables> = gql`
  query imageSearch($query: String, $page: Int, $pageSize: Int, $license: String) {
    imageSearch(query: $query, page: $page, pageSize: $pageSize, license: $license) {
      totalCount
      pageSize
      page
      language
      results {
        ...Image
      }
    }
  }
  ${imageFragment}
`;

export const fetchImageQuery: TypedDocumentNode<GQLFetchImageQuery, GQLFetchImageQueryVariables> = gql`
  query fetchImage($id: String!) {
    imageV3(id: $id) {
      ...Image
    }
  }
  ${imageFragment}
`;
