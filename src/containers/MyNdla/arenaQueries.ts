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
  GQLArenaTopicsByUserQuery,
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
    location
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

export const arenaTopicsByUserQuery = gql`
  query arenaTopicsByUser($userSlug: String!) {
    arenaTopicsByUser(userSlug: $userSlug) {
      ...ArenaTopicFragment
    }
  }
  ${arenaTopicFragment}
`;

export const useArenaUser = (
  username: string,
  options?: QueryHookOptions<GQLArenaUserQuery, GQLArenaUserQueryVariables>,
) => {
  const { data } = useGraphQuery<GQLArenaUserQuery, GQLArenaUserQueryVariables>(
    arenaUserQuery,
    {
      variables: { username },
      ...options,
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

export const useArenaTopicsByUser = (
  userSlug: string,
  options?: QueryHookOptions<GQLArenaTopicsByUserQuery>,
) => {
  const { data, loading, error } = useGraphQuery<GQLArenaTopicsByUserQuery>(
    arenaTopicsByUserQuery,
    { variables: { userSlug }, ...options },
  );
  return { arenaTopicsByUser: data?.arenaTopicsByUser, loading, error };
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
