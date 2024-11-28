/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, MutationHookOptions, useMutation } from "@apollo/client";
import {
  GQLDeleteLearningpathMutation,
  GQLMutationDeleteLearningpathArgs,
  GQLMutationUpdateLearningpathStatusArgs,
  GQLMyLearningpathsQuery,
  GQLUpdateLearningpathStatusMutation,
} from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

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

const myLearningpathQuery = gql`
  query MyLearningpaths {
    myLearningpaths {
      ...Learningpath
    }
  }
  ${learningpathFragment}
`;

export const useMyLearningpaths = () => useGraphQuery<GQLMyLearningpathsQuery>(myLearningpathQuery);

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
      ...Learningpath
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
