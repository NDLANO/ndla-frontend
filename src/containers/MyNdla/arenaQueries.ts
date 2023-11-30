/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { QueryHookOptions, gql } from '@apollo/client';
import {
  GQLArenaUserQuery,
  GQLArenaPageQuery,
  GQLArenaCategoryQuery,
  GQLArenaTopicByIdQuery,
  GQLArenaTopicByIdQueryVariables,
  GQLArenaCategoryQueryVariables,
  GQLArenaUserQueryVariables,
  GQLArenaRecentTopicsQuery,
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
    isFollowing
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
      groupTitleArray
      profilePicture
      username
    }
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

export const useArenaCategory = (
  options: QueryHookOptions<
    GQLArenaCategoryQuery,
    GQLArenaCategoryQueryVariables
  >,
) => {
  const { data, loading, error } = useGraphQuery(arenaCategoryQuery, options);
  return { arenaCategory: data?.arenaCategory, loading, error };
};

export const useArenaTopic = (
  options: QueryHookOptions<
    GQLArenaTopicByIdQuery,
    GQLArenaTopicByIdQueryVariables
  >,
) => {
  const { data, loading, error } = useGraphQuery(arenaTopicById, options);
  return { arenaTopic: data?.arenaTopic, loading, error };
};

const arenaRecentTopics = gql`
  query arenaRecentTopics {
    arenaRecentTopics {
      ...ArenaTopicFragment
    }
  }
  ${arenaTopicFragment}
`;

export const useRecentTopics = (
  options?: QueryHookOptions<GQLArenaRecentTopicsQuery>,
) => {
  const { data, ...rest } = useGraphQuery<GQLArenaRecentTopicsQuery>(
    arenaRecentTopics,
    options,
  );
  return {
    data: data?.arenaRecentTopics,
    ...rest,
  };
};
