/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MutationHookOptions, gql, useMutation } from '@apollo/client';
import {
  GQLDeletePostMutation,
  GQLDeletePostMutationVariables,
  GQLDeleteTopicMutation,
  GQLDeleteTopicMutationVariables,
  GQLNewArenaTopicMutation,
  GQLNewArenaTopicMutationVariables,
  GQLNewFlagMutation,
  GQLNewFlagMutationVariables,
  GQLReplyToTopicMutation,
  GQLReplyToTopicMutationVariables,
  GQLUpdatePostMutation,
  GQLUpdatePostMutationVariables,
} from '../../graphqlTypes';
import { arenaPostFragment, arenaTopicFragment } from './arenaQueries';

const newFlagMutation = gql`
  mutation newFlag($id: Int!, $reason: String!, $type: String!) {
    newFlag(id: $id, reason: $reason, type: $type)
  }
`;

export const useNewFlagMutation = () => {
  const [addNewFlag] = useMutation<GQLNewFlagMutation, GQLNewFlagMutationVariables>(
    newFlagMutation,
  );
  return { addNewFlag };
};

const replyToTopicMutation = gql`
  mutation ReplyToTopic($topicId: Int!, $content: String!) {
    replyToTopic(topicId: $topicId, content: $content) {
      ...ArenaPostFragment
    }
  }
  ${arenaPostFragment}
`;

export const useReplyToTopic = (
  options?: MutationHookOptions<
    GQLReplyToTopicMutation,
    GQLReplyToTopicMutationVariables
  >,
) => {
  const [replyToTopic] = useMutation<
    GQLReplyToTopicMutation,
    GQLReplyToTopicMutationVariables
  >(replyToTopicMutation, options);
  return { replyToTopic };
};

const updatePostMutation = gql`
  mutation UpdatePost($postId: Int!, $content: String!, $title: String) {
    updatePost(postId: $postId, content: $content, title: $title) {
      ...ArenaPostFragment
    }
  }
  ${arenaPostFragment}
`;

export const useUpdatePost = (
  options: MutationHookOptions<
    GQLUpdatePostMutation,
    GQLUpdatePostMutationVariables
  >,
) => {
  const [updatePost] = useMutation<
    GQLUpdatePostMutation,
    GQLUpdatePostMutationVariables
  >(updatePostMutation, options);
  return { updatePost };
};

const deletePostMutation = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const useDeletePost = (
  options: MutationHookOptions<
    GQLDeletePostMutation,
    GQLDeletePostMutationVariables
  >,
) => {
  const [deletePost] = useMutation<
    GQLDeletePostMutation,
    GQLDeletePostMutationVariables
  >(deletePostMutation, options);
  return { deletePost };
};

const deleteTopicMutation = gql`
  mutation DeleteTopic($topicId: Int!) {
    deleteTopic(topicId: $topicId)
  }
`;

export const useDeleteTopic = (
  options: MutationHookOptions<
    GQLDeleteTopicMutation,
    GQLDeleteTopicMutationVariables
  >,
) => {
  const [deleteTopic] = useMutation<
    GQLDeleteTopicMutation,
    GQLDeleteTopicMutationVariables
  >(deleteTopicMutation, options);
  return { deleteTopic };
};

const newArenaTopicMutation = gql`
  mutation NewArenaTopic(
    $categoryId: Int!
    $content: String!
    $title: String!
  ) {
    newArenaTopic(categoryId: $categoryId, content: $content, title: $title) {
      ...ArenaTopicFragment
    }
  }
  ${arenaTopicFragment}
`;

export const useCreateArenaTopic = (
  options: MutationHookOptions<
    GQLNewArenaTopicMutation,
    GQLNewArenaTopicMutationVariables
  >,
) => {
  const [createArenaTopic] = useMutation<
    GQLNewArenaTopicMutation,
    GQLNewArenaTopicMutationVariables
  >(newArenaTopicMutation, options);
  return { createArenaTopic };
};
