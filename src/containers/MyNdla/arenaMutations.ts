/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useMutation } from '@apollo/client';
import {
  GQLMutationNewArenaTopicArgs,
  GQLMutationNewFlagArgs,
  GQLMutationReplyToTopicArgs,
  GQLNewArenaTopicMutation,
  GQLNewFlagMutation,
  GQLReplyToTopicMutation,
  GQLUpdateFolderMutation,
  GQLUpdatePostMutationVariables,
} from '../../graphqlTypes';
import {
  arenaPostFragment,
  arenaTopicById,
  arenaTopicFragment,
  arenaCategoryQuery,
} from './arenaQueries';

const newFlagMutation = gql`
  mutation newFlag($id: Int!, $reason: String!, $type: String!) {
    newFlag(id: $id, reason: $reason, type: $type)
  }
`;

export const useNewFlagMutation = () => {
  const [addNewFlag] = useMutation<GQLNewFlagMutation, GQLMutationNewFlagArgs>(
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

export const useReplyToTopic = (topicId: number) => {
  const [replyToTopic] = useMutation<
    GQLReplyToTopicMutation,
    GQLMutationReplyToTopicArgs
  >(replyToTopicMutation, {
    refetchQueries: [
      { query: arenaTopicById, variables: { topicId, page: 1 } },
    ],
  });
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

export const useUpdatePost = (topicId: number) => {
  const [updatePost] = useMutation<
    GQLUpdateFolderMutation,
    GQLUpdatePostMutationVariables
  >(updatePostMutation, {
    refetchQueries: [
      { query: arenaTopicById, variables: { topicId, page: 1 } },
    ],
  });
  return { updatePost };
};

const deletePostMutation = gql`
  mutation DeletePost($postId: Int!) {
    deletePost(postId: $postId)
  }
`;

export const useDeletePost = (topicId: number) => {
  const [deletePost] = useMutation(deletePostMutation, {
    refetchQueries: [
      { query: arenaTopicById, variables: { topicId, page: 1 } },
    ],
  });
  return { deletePost };
};

const deleteTopicMutation = gql`
  mutation DeleteTopic($topicId: Int!) {
    deleteTopic(topicId: $topicId)
  }
`;

export const useDeleteTopic = () => {
  const [deleteTopic] = useMutation(deleteTopicMutation);
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

export const useCreateArenaTopic = (categoryId: number) => {
  const [createArenaTopic] = useMutation<
    GQLNewArenaTopicMutation,
    GQLMutationNewArenaTopicArgs
  >(newArenaTopicMutation, {
    refetchQueries: [
      { query: arenaCategoryQuery, variables: { categoryId, page: 1 } },
    ],
  });
  return { createArenaTopic };
};
