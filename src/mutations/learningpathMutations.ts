/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MutationHookOptions, useMutation, gql, useApolloClient } from "@apollo/client";
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
  GQLUpdateLearningpathStepSeqNoMutation,
  GQLUpdateLearningpathStepSeqNoMutationVariables,
} from "../graphqlTypes";
import { learningpathFragment, learningpathStepFragment } from "../fragments/learningpathFragments";

const deleteLearningpathMutation = gql`
  mutation deleteLearningpath($id: Int!) {
    deleteLearningpath(id: $id)
  }
`;

export const useDeleteLearningpath = (
  options?: MutationHookOptions<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>,
) => {
  const client = useApolloClient();
  return useMutation<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>(deleteLearningpathMutation, {
    ...options,
    onCompleted: (_data, methodOptions) => {
      const normalizedId = client.cache.identify({
        __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
      });
      client.cache.evict({ id: normalizedId });
      client.cache.gc();
    },
  });
};

const updateLearningpathStatusMutation = gql`
  mutation updateLearningpathStatus($id: Int!, $status: String!, $includeSteps: Boolean = false) {
    updateLearningpathStatus(id: $id, status: $status) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useUpdateLearningpathStatus = (
  options?: MutationHookOptions<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>,
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>(
    updateLearningpathStatusMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        const normalizedId = client.cache.identify({
          __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
        });
        client.cache.modify({
          id: normalizedId,
          fields: {
            status: () => {
              return methodOptions?.variables?.status;
            },
          },
        });
      },
    },
  );
};

const newLearningpathMutation = gql`
  mutation newLearningpath($params: LearningpathNewInput!, $includeSteps: Boolean = false) {
    newLearningpath(params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useCreateLearningpath = (
  options?: MutationHookOptions<GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables>,
) => {
  const client = useApolloClient();
  const [createLearningpath, { loading, error }] = useMutation<
    GQLNewLearningpathMutation,
    GQLNewLearningpathMutationVariables
  >(newLearningpathMutation, {
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
) => {
  const client = useApolloClient();
  return useMutation<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>(
    newLearningpathStepMutation,
    {
      ...options,
      onCompleted: (data, methodOptions) => {
        client.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "learningpath",
          args: { pathId: methodOptions?.variables?.learningpathId?.toString() },
        });
        client.cache.modify({
          id: client.cache.identify({
            __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
          }),
          fields: {
            learningsteps: (existingSteps = []) => {
              return existingSteps.concat({
                __ref: client.cache.identify(data.newLearningpathStep),
              });
            },
          },
        });
      },
    },
  );
};

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
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>(
    updateLearningpathStepMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        client.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "learningpath",
          args: { pathId: methodOptions?.variables?.learningpathId?.toString() },
        });
        client.cache.modify({
          id: client.cache.identify({
            __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningpathStep}`,
          }),
          fields: {
            description: () => {
              return methodOptions?.variables?.description;
            },
            introduction: () => {
              return methodOptions?.variables?.introudction;
            },
            title: () => {
              return methodOptions?.variables?.title;
            },
            embedUrl: () => {
              return {
                url: methodOptions?.variables?.embedUrl,
                embedType: methodOptions?.variables?.embedType,
              };
            },
            type: () => {
              return methodOptions?.variables?.type;
            },
            revision: () => {
              return methodOptions?.variables?.revision;
            },
          },
        });
      },
    },
  );
};

const deleteLearningpathStepMutation = gql`
  mutation deleteLearningpathStep($learningpathId: Int!, $learningstepId: Int!) {
    deleteLearningpathStep(learningpathId: $learningpathId, learningstepId: $learningstepId)
  }
`;

export const useDeleteLearningpathStep = (
  options?: MutationHookOptions<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>(
    deleteLearningpathStepMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        client.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "learningpath",
          args: { pathId: methodOptions?.variables?.learningpathId?.toString() },
        });
        const normalizedId = client.cache.identify({
          __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningstepId}`,
        });
        client.cache.evict({ id: normalizedId, broadcast: true });
        client.cache.gc();
      },
    },
  );
};

const updateLearningpathMutation = gql`
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
  options?: MutationHookOptions<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>(
    updateLearningpathMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        client.cache.modify({
          id: client.cache.identify({
            __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
          }),
          fields: {
            title: () => {
              return methodOptions?.variables?.title;
            },
            coverPhotoMetaUrl: () => {
              return methodOptions?.variables?.coverPhotoMetaUrl;
            },
          },
        });
      },
    },
  );
};

const copyLearningpathMutation = gql`
  mutation copyLearningpath($learningpathId: Int!, $params: LearningpathCopyInput!, $includeSteps: Boolean = false) {
    copyLearningpath(learningpathId: $learningpathId, params: $params) {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useCopyLearningpathMutation = (
  options?: MutationHookOptions<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>,
) => useMutation<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>(copyLearningpathMutation, options);

const updateLearningpathStepSeqNo = gql`
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

export const useUpdateLearningpathStepSeqNo = (
  options?: MutationHookOptions<
    GQLUpdateLearningpathStepSeqNoMutation,
    GQLUpdateLearningpathStepSeqNoMutationVariables
  >,
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStepSeqNoMutation, GQLUpdateLearningpathStepSeqNoMutationVariables>(
    updateLearningpathStepSeqNo,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        client.cache.evict({
          id: "ROOT_QUERY",
          fieldName: "learningpath",
          args: { pathId: methodOptions?.variables?.learningpathId?.toString() },
        });
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
              updatedStepsOrder.splice(methodOptions?.variables?.seqNo, 0, movedElement);
              return updatedStepsOrder;
            },
          },
        });
        client.cache.modify({
          id: client.cache.identify({
            __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningpathStepId}`,
          }),
          fields: {
            revision: () => {
              return methodOptions?.variables?.revision;
            },
          },
        });
        client.cache.gc();
      },
    },
  );
};
