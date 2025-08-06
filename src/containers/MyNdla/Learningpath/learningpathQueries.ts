/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, QueryHookOptions, useLazyQuery, useQuery } from "@apollo/client";
import {
  GQLMyLearningpathsQuery,
  GQLMyNdlaLearningpathQuery,
  GQLMyNdlaLearningpathQueryVariables,
  GQLLearningpathStepOembedQuery,
  GQLLearningpathStepOembedQueryVariables,
  GQLOpengraphQuery,
  GQLOpengraphQueryVariables,
} from "../../../graphqlTypes";
import { learningpathFragment, learningpathStepOembed } from "../../../fragments/learningpathFragments";

export const myLearningpathQuery = gql`
  query MyLearningpaths($includeSteps: Boolean = false) {
    myLearningpaths {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useMyLearningpaths = () => useQuery<GQLMyLearningpathsQuery>(myLearningpathQuery);

export const learningpathQuery = gql`
  query myNdlaLearningpath($pathId: String!, $includeSteps: Boolean = true) {
    myNdlaLearningpath(pathId: $pathId) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useFetchLearningpath = (
  options: QueryHookOptions<GQLMyNdlaLearningpathQuery, GQLMyNdlaLearningpathQueryVariables>,
) => useQuery<GQLMyNdlaLearningpathQuery, GQLMyNdlaLearningpathQueryVariables>(learningpathQuery, options);

const fetchOembedUrl = gql`
  query learningpathStepOembed($url: String!) {
    learningpathStepOembed(url: $url) {
      ...LearningpathStepOembed
    }
  }
  ${learningpathStepOembed}
`;

export const useFetchOembed = (
  options?: QueryHookOptions<GQLLearningpathStepOembedQuery, GQLLearningpathStepOembedQueryVariables>,
) => useQuery<GQLLearningpathStepOembedQuery, GQLLearningpathStepOembedQueryVariables>(fetchOembedUrl, options);

const opengraphQuery = gql`
  query opengraph($url: String!) {
    opengraph(url: $url) {
      title
      description
      imageUrl
      url
    }
  }
`;

export const useFetchOpengraph = (options?: QueryHookOptions<GQLOpengraphQuery, GQLOpengraphQueryVariables>) =>
  useLazyQuery<GQLOpengraphQuery, GQLOpengraphQueryVariables>(opengraphQuery, options);
