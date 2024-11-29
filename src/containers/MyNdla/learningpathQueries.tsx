/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, MutationHookOptions, QueryHookOptions, useMutation } from "@apollo/client";
import {
  GQLLearningpathsQuery,
  GQLLearningpathsQueryVariables,
  GQLNewLearningpathMutation,
  GQLNewLearningpathMutationVariables,
} from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";
import { plainLearningpathContainerFragments } from "../PlainLearningpathPage/PlainLearningpathContainer";
import Learningpath from "../../components/Learningpath/Learningpath";

const learningpathFragment = gql`
  fragment Learningpath on Learningpath {
    id
    title
    description
    created
    status
    madeAvailable
    coverphoto {
      url
    }
  }
`;

const newLearningpathMutation = gql`
  mutation newLearningpath($params: LearningpathNewInput!) {
    newLearningpath(params: $params) {
      ...Learningpath
    }
  }
  ${learningpathFragment}
`;

export const useCreateLearningpath = (
  options?: MutationHookOptions<GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables>,
) => {
  const [createLearningpath, { loading, error }] = useMutation<
    GQLNewLearningpathMutation,
    GQLNewLearningpathMutationVariables
  >(newLearningpathMutation, options);
  return { createLearningpath, loading, error };
};

const learningpathQuery = gql`
  query learningpaths($pathId: String!, $transformArgs: TransformedArticleContentInput) {
    learningpath(pathId: $pathId) {
      ...PlainLearningpathContainer_Learningpath
    }
  }
  ${plainLearningpathContainerFragments.learningpath}
`;

export const useFetchLearningpath = (
  options: QueryHookOptions<GQLLearningpathsQuery, GQLLearningpathsQueryVariables>,
) => {
  const { data, error, loading } = useGraphQuery<GQLLearningpathsQuery, GQLLearningpathsQueryVariables>(
    learningpathQuery,
    options,
  );
  return { learningpath: data?.learningpath, error, loading };
};

const newLearningstepMutation = gql`
  mutation newLearningstep($params: LearningstepNewInput!) {
    newLearningstep(params: $params) {

    }
  }
    ${Learningpath.fragments.learningpathStep}
`;

export const useCreateLearningstep = (
  options: QueryHookOptions<GQLLearningpathsQuery, GQLLearningpathsQueryVariables>,
) => useMutation<>();
