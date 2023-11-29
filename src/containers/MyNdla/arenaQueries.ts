/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useMutation } from '@apollo/client';
import {
  GQLArenaUserQuery,
  GQLArenaPageQuery,
  GQLArenaCategoryQuery,
  GQLArenaTopicByIdQuery,
  GQLArenaTopicByIdQueryVariables,
  GQLArenaCategoryQueryVariables,
  GQLArenaUserQueryVariables,
  GQLMutationNewArenaTopicArgs,
  GQLMutationReplyToTopicArgs,
  GQLNewArenaTopicMutation,
  GQLReplyToTopicMutation,
  GQLUpdateFolderMutation,
  GQLUpdatePostMutationVariables,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

const arenaUserFragment = gql`
  fragment ArenaUserQueryFragment on ArenaUser {
    displayName
    id
    profilePicture
    slug
    groupTitleArray
  }
`;

const arenaCategoriesFragment = gql`
  fragment ArenaCategoriesFragment on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    postCount
    slug
  }
`;

const arenaCategoryFragment = gql`
  fragment ArenaCategoryFragment on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    postCount
    slug
  }
`;

const arenaTopicFragment = gql`
  fragment ArenaTopicFragment on ArenaTopic {
    __typename
    categoryId
    id
    locked
    postCount
    slug
    timestamp
    title
    deleted
  }
`;

const arenaPostFragment = gql`
  fragment ArenaPostFragment on ArenaPost {
    __typename
    content
    id
    timestamp
    topicId
    isMainPost
    user {
      displayName
      profilePicture
      username
    }
    deleted
  }
`;

export const arenaUserQuery = gql`
  query ArenaUser($username: String!) {
    arenaUser(username: $username) {
      ...ArenaUserQueryFragment
    }
  }
  ${arenaUserFragment}
`;

export const arenaCategoriesQuery = gql`
  query arenaPage {
    arenaCategories {
      ...ArenaCategoriesFragment
    }
  }
  ${arenaCategoriesFragment}
`;

export const arenaCategoryQuery = gql`
  query arenaCategory($categoryId: Int!, $page: Int!) {
    arenaCategory(categoryId: $categoryId, page: $page) {
      ...ArenaCategoryFragment
      topics {
        ...ArenaTopicFragment
      }
      topicCount
    }
  }
  ${arenaCategoryFragment}
  ${arenaTopicFragment}
`;

export const arenaTopicById = gql`
  query arenaTopicById($topicId: Int!, $page: Int!) {
    arenaTopic(topicId: $topicId, page: $page) {
      ...ArenaTopicFragment
      posts {
        ...ArenaPostFragment
      }
    }
  }
  ${arenaTopicFragment}
  ${arenaPostFragment}
`;

export const useArenaUser = (username: string) => {
  const { data } = useGraphQuery<GQLArenaUserQuery, GQLArenaUserQueryVariables>(
    arenaUserQuery,
    {
      variables: { username },
    },
  );
  return { arenaUser: data?.arenaUser };
};

export const useArenaCategories = () => {
  const { data, loading, error } =
    useGraphQuery<GQLArenaPageQuery>(arenaCategoriesQuery);
  return { arenaCategories: data?.arenaCategories, loading, error };
};

export const useArenaCategory = (categoryId: number, page: number) => {
  const { data, loading, error } = useGraphQuery<
    GQLArenaCategoryQuery,
    GQLArenaCategoryQueryVariables
  >(arenaCategoryQuery, {
    variables: { categoryId, page },
  });
  return { arenaCategory: data?.arenaCategory, loading, error };
};

export const useArenaTopic = (topicId: number, page: number) => {
  const { data, loading, error } = useGraphQuery<
    GQLArenaTopicByIdQuery,
    GQLArenaTopicByIdQueryVariables
  >(arenaTopicById, {
    variables: { topicId, page },
  });
  return { arenaTopic: data?.arenaTopic, loading, error };
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
