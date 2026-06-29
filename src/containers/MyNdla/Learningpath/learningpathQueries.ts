/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, TypedDocumentNode } from "@apollo/client";
import { learningpathFragment } from "../../../fragments/learningpathFragments";
import {
  GQLMyLearningpathsQuery,
  GQLMyNdlaLearningpathQuery,
  GQLMyNdlaLearningpathQueryVariables,
  GQLOpengraphQuery,
  GQLOpengraphQueryVariables,
  GQLMyLearningpathsQueryVariables,
} from "../../../graphqlTypes";

export const myLearningpathQuery: TypedDocumentNode<GQLMyLearningpathsQuery, GQLMyLearningpathsQueryVariables> = gql`
  query MyLearningpaths($includeSteps: Boolean = false) {
    myLearningpaths {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const learningpathQueryDef: TypedDocumentNode<GQLMyNdlaLearningpathQuery, GQLMyNdlaLearningpathQueryVariables> =
  gql`
    query myNdlaLearningpath($pathId: String!, $includeSteps: Boolean = true) {
      myNdlaLearningpath(pathId: $pathId) {
        ...MyNdlaLearningpath
      }
    }
    ${learningpathFragment}
  `;

export const opengraphQueryDef: TypedDocumentNode<GQLOpengraphQuery, GQLOpengraphQueryVariables> = gql`
  query opengraph($url: String!) {
    opengraph(url: $url) {
      title
      description
      imageUrl
      url
    }
  }
`;
