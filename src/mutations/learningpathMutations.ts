/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, TypedDocumentNode } from "@apollo/client";
import { useMutation, useApolloClient } from "@apollo/client/react";
import { learningpathFragment, learningpathStepFragment } from "../fragments/learningpathFragments";
import {
  GQLDeleteLearningpathMutation,
  GQLUpdateLearningpathStatusMutation,
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
  GQLUpdateLearningpathStepSeqNoMutation,
  GQLUpdateLearningpathStepSeqNoMutationVariables,
  GQLDeleteLearningpathMutationVariables,
  GQLUpdateLearningpathStatusMutationVariables,
  GQLMyNdlaLearningpathFragment,
} from "../graphqlTypes";

const deleteLearningpathMutation: TypedDocumentNode<
  GQLDeleteLearningpathMutation,
  GQLDeleteLearningpathMutationVariables
> = gql`
  mutation deleteLearningpath($id: Int!) {
    deleteLearningpath(id: $id)
  }
`;

export const useDeleteLearningpath = (
  options?: useMutation.Options<GQLDeleteLearningpathMutation, GQLDeleteLearningpathMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(deleteLearningpathMutation, {
    ...options,
    onCompleted: (_data, methodOptions) => {
      // TODO: Is this problematic? We don't remove it from the root query
      const normalizedId = client.cache.identify({
        __ref: `MyNdlaLearningpath:${methodOptions?.variables?.id}`,
      });
      client.cache.evict({ id: normalizedId });
      client.cache.gc();
    },
  });
};

const updateLearningpathStatusMutation: TypedDocumentNode<
  GQLUpdateLearningpathStatusMutation,
  GQLUpdateLearningpathStatusMutationVariables
> = gql`
  mutation updateLearningpathStatus($id: Int!, $status: String!, $includeSteps: Boolean = false) {
    updateLearningpathStatus(id: $id, status: $status) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useUpdateLearningpathStatus = (
  options?: useMutation.Options<GQLUpdateLearningpathStatusMutation, GQLUpdateLearningpathStatusMutationVariables>,
) => {
  return useMutation(updateLearningpathStatusMutation, options);
};

const newLearningpathMutation: TypedDocumentNode<GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables> = gql`
  mutation newLearningpath($params: LearningpathNewInput!, $includeSteps: Boolean = false) {
    newLearningpath(params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useCreateLearningpath = (
  options?: useMutation.Options<GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables>,
) => {
  const [createLearningpath, { loading, error, client }] = useMutation(newLearningpathMutation, {
    ...options,
    onCompleted: ({ newLearningpath }) => {
      client.cache.modify({
        fields: {
          myLearningpaths: (existingPaths = []) =>
            existingPaths.concat({
              __ref: client.cache.identify(newLearningpath),
            }),
        },
      });
    },
  });

  return { createLearningpath, loading, error };
};

const newLearningpathStepMutation: TypedDocumentNode<
  GQLNewLearningpathStepMutation,
  GQLNewLearningpathStepMutationVariables
> = gql`
  mutation newLearningpathStep($learningpathId: Int!, $params: LearningpathStepNewInput!) {
    newLearningpathStep(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpathStep
    }
  }
  ${learningpathStepFragment}
`;

export const useCreateLearningpathStep = (
  options?: useMutation.Options<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(newLearningpathStepMutation, {
    ...options,
    onCompleted: (data, methodOptions) => {
      client.cache.modify<GQLMyNdlaLearningpathFragment>({
        id: client.cache.identify({
          __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
        }),
        fields: {
          learningsteps: (existingSteps = []) => {
            return existingSteps.concat({
              __ref: client.cache.identify(data.newLearningpathStep)!,
            });
          },
          revision: (val) => val + 1,
        },
      });
    },
  });
};

const updateLearningpathStepMutation: TypedDocumentNode<
  GQLUpdateLearningpathStepMutation,
  GQLUpdateLearningpathStepMutationVariables
> = gql`
  mutation updateLearningpathStep($learningpathId: Int!, $learningstepId: Int!, $params: LearningpathStepUpdateInput!) {
    updateLearningpathStep(learningpathId: $learningpathId, learningstepId: $learningstepId, params: $params) {
      ...MyNdlaLearningpathStep
    }
  }
  ${learningpathStepFragment}
`;

export const useUpdateLearningpathStep = (
  options?: useMutation.Options<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(updateLearningpathStepMutation, {
    ...options,
    onCompleted: (data, opts) => {
      client.cache.updateFragment(
        { fragment: learningpathStepFragment, fragmentName: "MyNdlaLearningpathStep" },
        () => data.updateLearningpathStep,
      );
      client.cache.modify({
        id: client.cache.identify({ __ref: `MyNdlaLearningpath:${opts?.variables?.learningpathId}` }),
        fields: {
          revision: (val) => val + 1,
        },
      });
    },
  });
};

const deleteLearningpathStepMutation: TypedDocumentNode<
  GQLDeleteLearningpathStepMutation,
  GQLDeleteLearningpathStepMutationVariables
> = gql`
  mutation deleteLearningpathStep($learningpathId: Int!, $learningstepId: Int!) {
    deleteLearningpathStep(learningpathId: $learningpathId, learningstepId: $learningstepId)
  }
`;

export const useDeleteLearningpathStep = (
  options?: useMutation.Options<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(deleteLearningpathStepMutation, {
    ...options,
    onCompleted: (_data, opts) => {
      client.cache.modify<GQLMyNdlaLearningpathFragment>({
        id: client.cache.identify({
          __ref: `MyNdlaLearningpath:${opts?.variables?.learningpathId}`,
        }),
        fields: {
          revision: (val) => val + 1,
          learningsteps: (refs, fieldOpts) =>
            refs.filter((step) => fieldOpts.readField<number>("id", step) !== opts?.variables?.learningstepId),
        },
      });
    },
  });
};

const updateLearningpathMutation: TypedDocumentNode<
  GQLUpdateLearningpathMutation,
  GQLUpdateLearningpathMutationVariables
> = gql`
  mutation updateLearningpath(
    $learningpathId: Int!
    $params: LearningpathUpdateInput!
    $includeSteps: Boolean = false
  ) {
    updateLearningpath(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useUpdateLearningpath = (
  options?: useMutation.Options<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(updateLearningpathMutation, {
    ...options,
    onCompleted: (data) => {
      client.cache.updateFragment(
        { fragment: learningpathFragment, fragmentName: "MyNdlaLearningpath", variables: { includeSteps: false } },
        () => data.updateLearningpath,
      );
    },
  });
};

const copyLearningpathMutation: TypedDocumentNode<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables> =
  gql`
    mutation copyLearningpath($learningpathId: Int!, $params: LearningpathCopyInput!, $includeSteps: Boolean = false) {
      copyLearningpath(learningpathId: $learningpathId, params: $params) {
        ...MyNdlaLearningpath
      }
    }
    ${learningpathFragment}
  `;

export const useCopyLearningpathMutation = (
  options?: useMutation.Options<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation(copyLearningpathMutation, {
    ...options,
    onCompleted: ({ copyLearningpath }) => {
      client.cache.modify({
        fields: {
          myLearningpaths: (existingPaths = []) =>
            existingPaths.concat({
              __ref: client.cache.identify(copyLearningpath),
            }),
        },
      });
    },
  });
};

const updateLearningpathStepSeqNo: TypedDocumentNode<
  GQLUpdateLearningpathStepSeqNoMutation,
  GQLUpdateLearningpathStepSeqNoMutationVariables
> = gql`
  mutation updateLearningpathStepSeqNo($learningpathId: Int!, $learningpathStepId: Int!, $seqNo: Int!) {
    updateLearningpathStepSeqNo(
      learningpathId: $learningpathId
      learningpathStepId: $learningpathStepId
      seqNo: $seqNo
    ) {
      seqNo
    }
  }
`;

export const useUpdateLearningpathStepSeqNo = () => {
  const client = useApolloClient();
  return useMutation(updateLearningpathStepSeqNo, {
    onCompleted: (_data, methodOptions) => {
      const seqNo = methodOptions?.variables?.seqNo;
      if (seqNo === undefined) return;
      client.cache.modify({
        id: client.cache.identify({
          __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
        }),
        fields: {
          learningsteps: (existingSteps = []) => {
            const updatedStepsOrder = [...existingSteps];
            const fromIndex = updatedStepsOrder.findIndex(
              (el) => el.__ref === `MyNdlaLearningpathStep:${methodOptions?.variables?.learningpathStepId}`,
            );
            const movedElement = updatedStepsOrder[fromIndex];
            // Remove from old position
            updatedStepsOrder.splice(fromIndex, 1);
            // Add to new position
            updatedStepsOrder.splice(seqNo, 0, movedElement);
            return updatedStepsOrder;
          },
        },
      });
      client.cache.modify({
        id: client.cache.identify({
          __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningpathStepId}`,
        }),
        fields: {
          revision: (val) => val + 1,
        },
      });
      client.cache.gc();
    },
  });
};
