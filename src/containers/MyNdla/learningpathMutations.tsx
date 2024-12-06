/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import { learningpathFragment, learningpathStepFragment } from "./learningpathUtils";
import {
  GQLNewLearningpathMutation,
  GQLNewLearningpathMutationVariables,
  GQLNewLearningpathStepMutation,
  GQLNewLearningpathStepMutationVariables,
  GQLUpdateLearningpathStepMutation,
  GQLUpdateLearningpathStepMutationVariables,
} from "../../graphqlTypes";

const newLearningpathMutation = gql`
  mutation newLearningpath($params: LearningpathNewInput!) {
    newLearningpath(params: $params) {
      ...MyNdlaLearningpath
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

const newLearningpathStepMutation = gql`
  mutation newLearningpathStep($learningpathId: Int!, $params: LearningpathStepNewInput!) {
    newLearningpathStep(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpathStep
    }
  }
  ${learningpathStepFragment}
`;

export const useCreateLearningpathStep = (
  options?: MutationHookOptions<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>,
) =>
  useMutation<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>(
    newLearningpathStepMutation,
    options,
  );

const updateLearningpathStepMutation = gql`
  mutation updateLearningpathStep($learningpathId: Int!, $learningstepId: Int!, $params: LearningpathStepUpdateInput!) {
    updateLearningpathStep(learningpathId: $learningpathId, learningstepId: $learningstepId, params: $params) {
      ...MyNdlaLearningpathStep
    }
  }
  ${learningpathStepFragment}
`;
export const useUpdateLearningpathStep = (
  options?: MutationHookOptions<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>,
) =>
  useMutation<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>(
    updateLearningpathStepMutation,
    options,
  );
