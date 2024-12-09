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
} from "../../../graphqlTypes";
import { learningpathFragment } from "./learningpathFragments";

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
