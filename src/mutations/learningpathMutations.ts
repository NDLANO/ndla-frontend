/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useMutation, useApolloClient } from "@apollo/client/react";
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
  options?: useMutation.Options<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>,
) => {
  const client = useApolloClient();
  return useMutation<GQLDeleteLearningpathMutation, GQLMutationDeleteLearningpathArgs>(deleteLearningpathMutation, {
    ...options,
    onCompleted: (_data, methodOptions) => {
      const normalizedId = client.cache.identify({
        __ref: `MyNdlaLearningpath:${methodOptions?.variables?.id}`,
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
  options?: useMutation.Options<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>,
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStatusMutation, GQLMutationUpdateLearningpathStatusArgs>(
    updateLearningpathStatusMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        const normalizedId = client.cache.identify({
          __ref: `MyNdlaLearningpath:${methodOptions?.variables?.id}`,
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
  options?: useMutation.Options<GQLNewLearningpathMutation, GQLNewLearningpathMutationVariables>,
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
  options?: useMutation.Options<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>,
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
  options?: useMutation.Options<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>,
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
            __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningstepId}`,
          }),
          fields: {
            description: () => {
              return methodOptions?.variables?.params?.description;
            },
            introduction: () => {
              return methodOptions?.variables?.params?.introduction;
            },
            title: () => {
              return methodOptions?.variables?.params?.title;
            },
            embedUrl: () => {
              return {
                url: methodOptions?.variables?.params?.embedUrl,
                // TODO: ??
                embedType: "iframe",
              };
            },
            type: () => {
              return methodOptions?.variables?.params?.type;
            },
            revision: () => {
              return methodOptions?.variables?.params?.revision;
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
  options?: useMutation.Options<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>,
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
        client.cache.modify({
          id: client.cache.identify({
            __ref: `MyNdlaLearningpath:${methodOptions?.variables?.learningpathId}`,
          }),
          fields: {
            revision: (val) => {
              return val + 1;
            },
          },
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
  options?: useMutation.Options<GQLUpdateLearningpathMutation, GQLUpdateLearningpathMutationVariables>,
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
              return methodOptions?.variables?.params?.title;
            },
            coverPhotoMetaUrl: () => {
              return methodOptions?.variables?.params?.coverPhotoMetaUrl;
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
  options?: useMutation.Options<GQLCopyLearningpathMutation, GQLCopyLearningpathMutationVariables>,
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

export const useUpdateLearningpathStepSeqNo = () => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStepSeqNoMutation, GQLUpdateLearningpathStepSeqNoMutationVariables>(
    updateLearningpathStepSeqNo,
    {
      onCompleted: (_data, methodOptions) => {
        const seqNo = methodOptions?.variables?.seqNo;
        if (seqNo === undefined) return;
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
            revision: (val) => {
              return val + 1;
            },
          },
        });
        client.cache.gc();
      },
    },
  );
};
