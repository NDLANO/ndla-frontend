/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
import {
  GQLImageSearchQuery,
  GQLQueryImageSearchArgs,
  GQLFetchImageQuery,
  GQLFetchImageQueryVariables,
} from "../../graphqlTypes";

const imageFragment = gql`
  fragment Image on ImageMetaInformationV3 {
    id
    metaUrl
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
      dimensions {
        width
        height
      }
      language
    }
  }
`;

const imagesSearchQuery = gql`
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

const fetchImageQuery = gql`
  query fetchImage($id: String!) {
    imageV3(id: $id) {
      ...Image
    }
  }
  ${imageFragment}
`;

export const useImageSearch = (options?: useLazyQuery.Options<GQLImageSearchQuery>) =>
  useLazyQuery<GQLImageSearchQuery, GQLQueryImageSearchArgs>(imagesSearchQuery, {
    ...options,
  });

export const useFetchImage = (options?: useLazyQuery.Options<GQLFetchImageQuery, GQLFetchImageQueryVariables>) =>
  useLazyQuery<GQLFetchImageQuery, GQLFetchImageQueryVariables>(fetchImageQuery, options);
