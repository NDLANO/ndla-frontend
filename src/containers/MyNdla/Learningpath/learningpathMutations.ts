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
} from "../../../graphqlTypes";
import { learningpathFragment, learningpathStepFragment } from "./learningpathFragments";
import { previewLearningpathQuery } from "./PreviewLearningpathPage";

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
  mutation updateLearningpathStatus($id: Int!, $status: String!) {
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
  const client = useApolloClient();
  const [createLearningpath, { loading, error }] = useMutation<
    GQLNewLearningpathMutation,
    GQLNewLearningpathMutationVariables
  >(newLearningpathMutation, {
    ...options,
    onCompleted: ({ newLearningpath }) => {
      client.cache.modify({
        fields: {
          myNdlaLearningpath: (existingPaths = []) =>
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
  pathId: string,
  options?: MutationHookOptions<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation<GQLNewLearningpathStepMutation, GQLNewLearningpathStepMutationVariables>(
    newLearningpathStepMutation,
    {
      ...options,
      refetchQueries: [{ query: previewLearningpathQuery, variables: { pathId } }],
      awaitRefetchQueries: true,
      onCompleted: (data, methodOptions) => {
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
  pathId: string,
  options?: MutationHookOptions<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation<GQLUpdateLearningpathStepMutation, GQLUpdateLearningpathStepMutationVariables>(
    updateLearningpathStepMutation,
    {
      ...options,
      refetchQueries: [{ query: previewLearningpathQuery, variables: { pathId } }],
      awaitRefetchQueries: true,
      onCompleted: (_data, methodOptions) => {
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
  pathId: string,
  options?: MutationHookOptions<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>,
) => {
  const client = useApolloClient();
  return useMutation<GQLDeleteLearningpathStepMutation, GQLDeleteLearningpathStepMutationVariables>(
    deleteLearningpathStepMutation,
    {
      ...options,
      onCompleted: (_data, methodOptions) => {
        const normalizedId = client.cache.identify({
          __ref: `MyNdlaLearningpathStep:${methodOptions?.variables?.learningstepId}`,
        });
        client.cache.evict({ id: normalizedId, broadcast: true });
        client.cache.gc();
      },
      refetchQueries: [{ query: previewLearningpathQuery, variables: { pathId } }],
      awaitRefetchQueries: true,
    },
  );
};

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
