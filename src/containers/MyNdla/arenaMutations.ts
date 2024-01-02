/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  MutationHookOptions,
  gql,
  useApolloClient,
  useMutation,
} from '@apollo/client';
import {
  arenaCategoriesV2Query,
  arenaCategoryV2Fragment,
  arenaCategoryV2Query,
  arenaFlagFragment,
  arenaFlagV2Query,
  arenaNotificationV2Query,
  arenaPostV2Fragment,
  arenaTopicV2Fragment,
} from './arenaQueries';
import { personalDataQueryFragment } from '../../components/AuthenticationContext';
import {
  GQLDeleteArenaCategoryMutation,
  GQLDeleteArenaCategoryMutationVariables,
  GQLDeletePostMutation,
  GQLDeletePostMutationVariables,
  GQLDeleteTopicV2Mutation,
  GQLDeleteTopicV2MutationVariables,
  GQLFollowTopicMutation,
  GQLMarkNotificationAsReadMutation,
  GQLMarkNotificationAsReadMutationVariables,
  GQLMutationFollowTopicArgs,
  GQLMutationResolveFlagArgs,
  GQLMutationUnfollowTopicArgs,
  GQLNewArenaCategoryMutation,
  GQLNewArenaCategoryMutationVariables,
  GQLNewArenaTopicV2Mutation,
  GQLNewArenaTopicV2MutationVariables,
  GQLNewFlagV2Mutation,
  GQLNewFlagV2MutationVariables,
  GQLReplyToTopicV2Mutation,
  GQLReplyToTopicV2MutationVariables,
  GQLResolveFlagMutation,
  GQLSortArenaCategoriesMutation,
  GQLSortArenaCategoriesMutationVariables,
  GQLUnfollowTopicMutation,
  GQLUpdateArenaCategoryMutation,
  GQLUpdateArenaCategoryMutationVariables,
  GQLUpdateOtherUserMutation,
  GQLUpdateOtherUserMutationVariables,
  GQLUpdatePostV2Mutation,
  GQLUpdatePostV2MutationVariables,
  GQLUpdateTopicV2Mutation,
  GQLUpdateTopicV2MutationVariables,
} from '../../graphqlTypes';

const newFlagMutationV2 = gql`
  mutation newFlagV2($id: Int!, $reason: String!) {
    newFlagV2(postId: $id, reason: $reason)
  }
`;

export const useNewFlagMutationV2 = () => {
  const [addNewFlag] = useMutation<
    GQLNewFlagV2Mutation,
    GQLNewFlagV2MutationVariables
  >(newFlagMutationV2, {
    refetchQueries: [arenaFlagV2Query],
  });
  return { addNewFlag };
};

const replyToTopicV2Mutation = gql`
  mutation ReplyToTopicV2($topicId: Int!, $content: String!) {
    replyToTopicV2(topicId: $topicId, content: $content) {
      ...ArenaPostV2
    }
  }
  ${arenaPostV2Fragment}
`;

export const useReplyToTopicV2 = (
  options?: MutationHookOptions<
    GQLReplyToTopicV2Mutation,
    GQLReplyToTopicV2MutationVariables
  >,
) => {
  const [replyToTopic] = useMutation<
    GQLReplyToTopicV2Mutation,
    GQLReplyToTopicV2MutationVariables
  >(replyToTopicV2Mutation, options);
  return { replyToTopic };
};

const updatePostMutationV2 = gql`
  mutation UpdatePostV2($postId: Int!, $content: String!) {
    updatePostV2(postId: $postId, content: $content) {
      ...ArenaPostV2
    }
  }
  ${arenaPostV2Fragment}
`;

export const useUpdatePostV2 = (
  options: MutationHookOptions<
    GQLUpdatePostV2Mutation,
    GQLUpdatePostV2MutationVariables
  >,
) => {
  const [updatePost] = useMutation<
    GQLUpdatePostV2Mutation,
    GQLUpdatePostV2MutationVariables
  >(updatePostMutationV2, options);
  return { updatePost };
};

const updateTopicMutationV2 = gql`
  mutation UpdateTopicV2($topicId: Int!, $content: String!, $title: String!) {
    updateTopicV2(topicId: $topicId, content: $content, title: $title) {
      ...ArenaTopicV2
    }
  }
  ${arenaTopicV2Fragment}
`;

export const useUpdateTopicV2 = (
  options: MutationHookOptions<
    GQLUpdateTopicV2Mutation,
    GQLUpdateTopicV2MutationVariables
  >,
) => {
  const [updateTopic] = useMutation<
    GQLUpdateTopicV2Mutation,
    GQLUpdateTopicV2MutationVariables
  >(updateTopicMutationV2, options);
  return { updateTopic };
};

const deletePostMutationV2 = gql`
  mutation DeletePostV2($postId: Int!) {
    deletePostV2(postId: $postId)
  }
`;

export const useDeletePostV2 = (
  options: MutationHookOptions<
    GQLDeletePostMutation,
    GQLDeletePostMutationVariables
  >,
) => {
  const [deletePost] = useMutation<
    GQLDeletePostMutation,
    GQLDeletePostMutationVariables
  >(deletePostMutationV2, {
    refetchQueries: [{ query: arenaFlagV2Query }],
    ...options,
  });
  return { deletePost };
};

const deleteTopicMutationV2 = gql`
  mutation DeleteTopicV2($topicId: Int!) {
    deleteTopicV2(topicId: $topicId)
  }
`;

export const useDeleteTopicV2 = (
  options: MutationHookOptions<
    GQLDeleteTopicV2Mutation,
    GQLDeleteTopicV2MutationVariables
  >,
) => {
  const [deleteTopic] = useMutation<
    GQLDeleteTopicV2Mutation,
    GQLDeleteTopicV2MutationVariables
  >(deleteTopicMutationV2, {
    refetchQueries: [{ query: arenaFlagV2Query }],
    ...options,
  });
  return { deleteTopic };
};

const newArenaTopicMutationV2 = gql`
  mutation NewArenaTopicV2(
    $categoryId: Int!
    $content: String!
    $title: String!
  ) {
    newArenaTopicV2(categoryId: $categoryId, content: $content, title: $title) {
      ...ArenaTopicV2
    }
  }
  ${arenaTopicV2Fragment}
`;

export const useCreateArenaTopicV2 = (
  options: MutationHookOptions<
    GQLNewArenaTopicV2Mutation,
    GQLNewArenaTopicV2MutationVariables
  >,
) => {
  const [createArenaTopic] = useMutation<
    GQLNewArenaTopicV2Mutation,
    GQLNewArenaTopicV2MutationVariables
  >(newArenaTopicMutationV2, options);
  return { createArenaTopic };
};

const newArenaCategoryMutation = gql`
  mutation NewArenaCategory(
    $title: String!
    $description: String!
    $visible: Boolean!
  ) {
    newArenaCategory(
      title: $title
      description: $description
      visible: $visible
    ) {
      ...ArenaCategoryV2
    }
  }
  ${arenaCategoryV2Fragment}
`;

export const useCreateArenaCategory = () => {
  const [createArenaCategory] = useMutation<
    GQLNewArenaCategoryMutation,
    GQLNewArenaCategoryMutationVariables
  >(newArenaCategoryMutation, {
    refetchQueries: [
      { query: arenaCategoriesV2Query },
      { query: arenaCategoryV2Query },
    ],
  });
  return { createArenaCategory };
};

const updateArenaCategoryMutation = gql`
  mutation UpdateArenaCategory(
    $categoryId: Int!
    $title: String!
    $description: String!
    $visible: Boolean!
  ) {
    updateArenaCategory(
      categoryId: $categoryId
      title: $title
      description: $description
      visible: $visible
    ) {
      ...ArenaCategoryV2
    }
  }
  ${arenaCategoryV2Fragment}
`;

export const useEditArenaCategory = () => {
  const [editArenaCategory] = useMutation<
    GQLUpdateArenaCategoryMutation,
    GQLUpdateArenaCategoryMutationVariables
  >(updateArenaCategoryMutation, {
    refetchQueries: [
      { query: arenaCategoriesV2Query },
      { query: arenaCategoryV2Query },
    ],
  });

  return { editArenaCategory };
};

const sortArenaCategoriesMutation = gql`
  mutation SortArenaCategories($categoryIds: [Int!]!) {
    sortArenaCategories(sortedIds: $categoryIds) {
      ...ArenaCategoryV2
    }
  }
  ${arenaCategoryV2Fragment}
`;

export const useArenaSortCategories = () => {
  const [sortArenaCategories] = useMutation<
    GQLSortArenaCategoriesMutation,
    GQLSortArenaCategoriesMutationVariables
  >(sortArenaCategoriesMutation, {
    refetchQueries: [{ query: arenaCategoriesV2Query }],
  });

  return sortArenaCategories;
};

const deleteArenaCategoryMutation = gql`
  mutation DeleteArenaCategory($categoryId: Int!) {
    deleteCategory(categoryId: $categoryId)
  }
`;

export const useArenaDeleteCategoryMutation = () => {
  const [deleteCategory] = useMutation<
    GQLDeleteArenaCategoryMutation,
    GQLDeleteArenaCategoryMutationVariables
  >(deleteArenaCategoryMutation, {
    refetchQueries: [
      { query: arenaCategoriesV2Query },
      { query: arenaCategoryV2Query },
    ],
  });
  return { deleteCategory };
};

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationsAsRead] = useMutation<
    GQLMarkNotificationAsReadMutation,
    GQLMarkNotificationAsReadMutationVariables
  >(arenaMarkNotificationAsReadMutation, {
    refetchQueries: [{ query: arenaNotificationV2Query }],
  });
  return { markNotificationsAsRead };
};

const resolveFlagMutation = gql`
  mutation resolveFlag($flagId: Int!) {
    resolveFlag(flagId: $flagId) {
      ...ArenaFlag
    }
  }
  ${arenaFlagFragment}
`;

const updateOtherUserMutation = gql`
  mutation updateOtherUser($userId: Int!, $user: ArenaUserV2Input!) {
    updateOtherArenaUser(userId: $userId, data: $user) {
      ...MyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

export const useUpdateOtherUser = () => {
  const { cache } = useApolloClient();
  return useMutation<
    GQLUpdateOtherUserMutation,
    GQLUpdateOtherUserMutationVariables
  >(updateOtherUserMutation, {
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __typename: 'ArenaUserV2',
          id: data.updateOtherArenaUser.id,
        }),
        fields: {
          groups: () => data.updateOtherArenaUser.arenaGroups,
        },
      });
    },
  });
};

export const useResolveFlagMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLResolveFlagMutation, GQLMutationResolveFlagArgs>(
    resolveFlagMutation,
    {
      onCompleted: (data) => {
        cache.modify({
          id: cache.identify({
            __typename: 'ArenaFlag',
            id: data.resolveFlag.id,
          }),
          fields: {
            resolved(_, { DELETE }) {
              if (!data.resolveFlag.resolved) {
                return DELETE;
              }
              return data.resolveFlag.resolved;
            },
            isResolved: () => data.resolveFlag.isResolved,
          },
        });
      },
    },
  );
};

const followTopicMutation = gql`
  mutation followTopic($topicId: Int!) {
    followTopic(topicId: $topicId) {
      ...ArenaTopicV2
    }
  }
  ${arenaTopicV2Fragment}
`;

export const useFollowTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLFollowTopicMutation, GQLMutationFollowTopicArgs>(
    followTopicMutation,
    {
      onCompleted: (data) => {
        cache.modify({
          id: cache.identify({
            __typename: 'ArenaTopicV2',
            id: data.followTopic.id,
          }),
          fields: {
            isFollowing: () => true,
          },
        });
      },
    },
  );
};

const unfollowTopicMutation = gql`
  mutation unfollowTopic($topicId: Int!) {
    unfollowTopic(topicId: $topicId) {
      ...ArenaTopicV2
    }
  }
  ${arenaTopicV2Fragment}
`;

export const useUnsubscribeFromTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLUnfollowTopicMutation, GQLMutationUnfollowTopicArgs>(
    unfollowTopicMutation,
    {
      onCompleted: (data) => {
        cache.modify({
          id: cache.identify({
            __typename: 'ArenaTopicV2',
            id: data.unfollowTopic.id,
          }),
          fields: {
            isFollowing: () => false,
          },
        });
      },
    },
  );
};
