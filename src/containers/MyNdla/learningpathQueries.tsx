/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, QueryHookOptions, useQuery } from "@apollo/client";
import {
  GQLFetchImageQuery,
  GQLFetchImageQueryVariables,
  GQLImageSearchQuery,
  GQLQueryImageSearchArgs,
  GQLQueryImageV3Args,
} from "../../graphqlTypes";

const imageFragment = gql`
  fragment ImageFragment on ImageMetaInformationV3 {
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
      filename
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
  query imageSearch($query: String, $page: Int, $pageSize: Int) {
    imageSearch(query: $query, page: $page, pageSize: $pageSize) {
      totalCount
      pageSize
      page
      language
      results {
        ...ImageFragment
      }
    }
  }
  ${imageFragment}
`;

const fetchImageQuery = gql`
  query fetchImage($id: String!) {
    imageV3(id: $id) {
      ...ImageFragment
    }
  }
  ${imageFragment}
`;

export const useImageSearch = (options?: QueryHookOptions<GQLImageSearchQuery>) => {
  const { error, loading, data, refetch } = useQuery<GQLImageSearchQuery, GQLQueryImageSearchArgs>(imagesSearchQuery, {
    ...options,
  });
  return { error, loading, searchResult: data?.imageSearch, refetch };
};

export const useFetchImage = (options?: QueryHookOptions<GQLFetchImageQuery, GQLFetchImageQueryVariables>) => {
  const { data, loading, error } = useQuery<GQLFetchImageQuery, GQLQueryImageV3Args>(fetchImageQuery, options);
  return { image: data?.imageV3, loading, error };
};
