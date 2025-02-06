/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MutationHookOptions, useMutation, gql } from "@apollo/client";
import {
  GQLDeleteLearningpathMutation,
  GQLMutationDeleteLearningpathArgs,
  GQLUpdateLearningpathStatusMutation,
  GQLMutationUpdateLearningpathStatusArgs,
  GQLDeleteLearningpathStepMutation,
  GQLDeleteLearningpathStepMutationVariables,
  GQLNewLearningpathMutation,
  GQLNewLearningpathMutationVariables,
  GQLNewLearningpathStepMutation,
  GQLNewLearningpathStepMutationVariables,
  GQLUpdateLearningpathStepMutation,
  GQLUpdateLearningpathStepMutationVariables,
  GQLUpdateLearningpathMutation,
  GQLUpdateLearningpathMutationVariables,
  GQLCopyLearningpathMutationVariables,
  GQLCopyLearningpathMutation,
} from "../../../graphqlTypes";
import { learningpathFragment, learningpathStepFragment } from "./learningpathFragments";

const deleteLearningpathMutation = gql`
  mutation deleteLearningpath($id: Int!) {
    deleteLearningpath(id: $id)
  }
`;

export const useDeleteLearningpath = (
  options?: MutationHookOptions<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>,
) => useMutation<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>(deleteLearningpathMutation, options);

const updateLearningpathStatusMutation = gql`
  mutation updateLearningpathStatus($id: Int!, $status: String!) {
    updateLearningpathStatus(id: $id, status: $status) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useUpdateLearningpathStatus = (
  options?: MutationHookOptions<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>,
) =>
  useMutation<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>(
    updateLearningpathStatusMutation,
    options,
  );

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

const deleteLearningpathStepMutation = gql`
  mutation deleteLearningpathStep($learningpathId: Int!, $learningstepId: Int!) {
    deleteLearningpathStep(learningpathId: $learningpathId, learningstepId: $learningstepId)
  }
`;
export const useDeleteLearningpathStep = (
  options?: MutationHookOptions<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>,
) =>
  useMutation<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>(
    deleteLearningpathStepMutation,
    options,
  );

const updateLearningpathMutation = gql`
  mutation updateLearningpath($learningpathId: Int!, $params: LearningpathUpdateInput!) {
    updateLearningpath(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;
export const useUpdateLearningpath = (
  options?: MutationHookOptions<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>,
) =>
  useMutation<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>(
    updateLearningpathMutation,
    options,
  );

const copyLearningpathMutation = gql`
  mutation copyLearningpath($learningpathId: Int!, $params: LearningpathCopyInput!) {
    copyLearningpath(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useCopyLearningpathMutation = (
  options?: MutationHookOptions<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>,
) => useMutation<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>(copyLearningpathMutation, options);
