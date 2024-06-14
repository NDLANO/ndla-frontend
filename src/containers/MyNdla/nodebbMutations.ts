/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MutationHookOptions, gql, useApolloClient, useMutation } from "@apollo/client";
import { arenaNotificationQuery, arenaPostFragment, arenaTopicById, arenaTopicFragment } from "./nodebbQueries";
import {
  GQLDeletePostMutation,
  GQLDeletePostMutationVariables,
  GQLDeleteTopicMutation,
  GQLDeleteTopicMutationVariables,
  GQLMarkNotificationAsReadMutation,
  GQLMarkNotificationAsReadMutationVariables,
  GQLMutationAddPostUpvoteArgs,
  GQLMutationRemovePostUpvoteArgs,
  GQLMutationSubscribeToTopicArgs,
  GQLMutationUnsubscribeFromTopicArgs,
  GQLNewArenaTopicMutation,
  GQLNewArenaTopicMutationVariables,
  GQLNewFlagMutation,
  GQLNewFlagMutationVariables,
  GQLReplyToTopicMutation,
  GQLReplyToTopicMutationVariables,
  GQLSubscribeToTopicMutation,
  GQLUnsubscribeFromTopicMutation,
  GQLUpdatePostMutation,
  GQLUpdatePostMutationVariables,
} from "../../graphqlTypes";

const newFlagMutation = gql`
  mutation newFlag($id: Int!, $reason: String!, $type: String!) {
    newFlag(id: $id, reason: $reason, type: $type)
  }
`;

export const useNewFlagMutation = () => {
  const [addNewFlag] = useMutation<GQLNewFlagMutation, GQLNewFlagMutationVariables>(newFlagMutation);
  return { addNewFlag };
};

const replyToTopicMutation = gql`
  mutation ReplyToTopic($topicId: Int!, $content: String!) {
    replyToTopic(topicId: $topicId, content: $content) {
      ...ArenaPost
    }
  }
  ${arenaPostFragment}
`;

export const useReplyToTopic = (
  options?: MutationHookOptions<GQLReplyToTopicMutation, GQLReplyToTopicMutationVariables>,
) => {
  const [replyToTopic] = useMutation<GQLReplyToTopicMutation, GQLReplyToTopicMutationVariables>(
    replyToTopicMutation,
    options,
  );
  return { replyToTopic };
};

const updatePostMutation = gql`
  mutation UpdatePost($postId: Int!, $content: String!, $title: String) {
    updatePost(postId: $postId, content: $content, title: $title) {
      ...ArenaPost
    }
  }
  ${arenaPostFragment}
`;

export const useUpdatePost = (options: MutationHookOptions<GQLUpdatePostMutation, GQLUpdatePostMutationVariables>) => {
  const [updatePost] = useMutation<GQLUpdatePostMutation, GQLUpdatePostMutationVariables>(updatePostMutation, options);
  return { updatePost };
};

const deletePostMutation = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const useDeletePost = (options: MutationHookOptions<GQLDeletePostMutation, GQLDeletePostMutationVariables>) => {
  const [deletePost] = useMutation<GQLDeletePostMutation, GQLDeletePostMutationVariables>(deletePostMutation, options);
  return { deletePost };
};

const deleteTopicMutation = gql`
  mutation DeleteTopic($topicId: Int!) {
    deleteTopic(topicId: $topicId)
  }
`;

export const useDeleteTopic = (
  options: MutationHookOptions<GQLDeleteTopicMutation, GQLDeleteTopicMutationVariables>,
) => {
  const [deleteTopic] = useMutation<GQLDeleteTopicMutation, GQLDeleteTopicMutationVariables>(
    deleteTopicMutation,
    options,
  );
  return { deleteTopic };
};

const newArenaTopicMutation = gql`
  mutation NewArenaTopic($categoryId: Int!, $content: String!, $title: String!) {
    newArenaTopic(categoryId: $categoryId, content: $content, title: $title) {
      ...ArenaTopic
    }
  }
  ${arenaTopicFragment}
`;

export const useCreateArenaTopic = (
  options: MutationHookOptions<GQLNewArenaTopicMutation, GQLNewArenaTopicMutationVariables>,
) => {
  const [createArenaTopic] = useMutation<GQLNewArenaTopicMutation, GQLNewArenaTopicMutationVariables>(
    newArenaTopicMutation,
    options,
  );
  return { createArenaTopic };
};

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkNotificationAsRead($topicIds: [Int!]!) {
    markNotificationAsRead(topicIds: $topicIds)
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationsAsRead] = useMutation<
    GQLMarkNotificationAsReadMutation,
    GQLMarkNotificationAsReadMutationVariables
  >(arenaMarkNotificationAsReadMutation, {
    refetchQueries: [{ query: arenaNotificationQuery }],
  });
  return { markNotificationsAsRead };
};

const subscribeToTopicMutation = gql`
  mutation subscribeToTopic($topicId: Int!) {
    subscribeToTopic(topicId: $topicId)
  }
`;

export const useSubscribeToTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLSubscribeToTopicMutation, GQLMutationSubscribeToTopicArgs>(subscribeToTopicMutation, {
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __typename: "ArenaTopic",
          id: data.subscribeToTopic,
        }),
        fields: {
          isFollowing: () => true,
        },
      });
    },
  });
};

const unsubscribeFromTopicMutation = gql`
  mutation unsubscribeFromTopic($topicId: Int!) {
    unsubscribeFromTopic(topicId: $topicId)
  }
`;

export const useUnsubscribeFromTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<GQLUnsubscribeFromTopicMutation, GQLMutationUnsubscribeFromTopicArgs>(
    unsubscribeFromTopicMutation,
    {
      onCompleted: (data) => {
        cache.modify({
          id: cache.identify({
            __typename: "ArenaTopic",
            id: data.unsubscribeFromTopic,
          }),
          fields: {
            isFollowing: () => false,
          },
        });
      },
    },
  );
};

const upvotePost = gql`
  mutation upvotePost($postId: Int!) {
    addPostUpvote(postId: $postId)
  }
`;

export const useUpvotePost = () => {
  const [upvote] = useMutation<GQLMutationAddPostUpvoteArgs>(upvotePost, { refetchQueries: [arenaTopicById] });
  return { upvote };
};

const removeUpvotePost = gql`
  mutation removeUpvotePost($postId: Int!) {
    removePostUpvote(postId: $postId)
  }
`;

export const useRemoveUpvotePost = () => {
  const [removeUpvote] = useMutation<GQLMutationRemovePostUpvoteArgs>(removeUpvotePost, {
    refetchQueries: [arenaTopicById],
  });
  return { removeUpvote };
};
