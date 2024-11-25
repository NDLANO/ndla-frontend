/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables } from "../../graphqlTypes";

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
