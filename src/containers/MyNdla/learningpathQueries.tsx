/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, QueryHookOptions } from "@apollo/client";
import { learningpathFragment, learningpathStepOembed } from "./learningpathUtils";
import {
  GQLLearningpathStepOembedQuery,
  GQLLearningpathStepOembedQueryVariables,
  GQLMyNdlaLearningpathQuery,
  GQLMyNdlaLearningpathQueryVariables,
} from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const learningpathQuery = gql`
  query myNdlaLearningpath($pathId: String!) {
    myNdlaLearningpath(pathId: $pathId) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useFetchLearningpath = (
  options: QueryHookOptions<GQLMyNdlaLearningpathQuery, GQLMyNdlaLearningpathQueryVariables>,
) => {
  const { data, error, loading } = useGraphQuery<GQLMyNdlaLearningpathQuery, GQLMyNdlaLearningpathQueryVariables>(
    learningpathQuery,
    options,
  );
  return { learningpath: data?.myNdlaLearningpath, error, loading };
};

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
) => useGraphQuery<GQLLearningpathStepOembedQuery, GQLLearningpathStepOembedQueryVariables>(fetchOembedUrl, options);
