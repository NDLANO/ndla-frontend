/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { QueryHookOptions, gql } from "@apollo/client";
import config from "../../config";
import {
  GQLArenaNotificationsQuery,
  GQLArenaUserQuery,
  GQLArenaPageQuery,
  GQLArenaCategoryQuery,
  GQLArenaTopicByIdQuery,
  GQLArenaTopicsByUserQuery,
  GQLArenaTopicByIdQueryVariables,
  GQLArenaCategoryQueryVariables,
  GQLArenaUserQueryVariables,
  GQLArenaRecentTopicsQuery,
  GQLArenaPageQueryVariables,
} from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const arenaUserFragment = gql`
  fragment ArenaUser on ArenaUser {
    displayName
    id
    profilePicture
    slug
    groupTitleArray
    location
    username
  }
`;

export const arenaCategoriesFragment = gql`
  fragment ArenaCategories on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    topicCount
    slug
  }
`;

export const arenaCategoryFragment = gql`
  fragment ArenaCategory on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    topicCount
    slug
  }
`;

export const arenaTopicFragment = gql`
  fragment ArenaTopic on ArenaTopic {
    __typename
    categoryId
    id
    locked
    postCount
    slug
    timestamp
    title
    deleted
    isFollowing
  }
`;

export const arenaPostFragment = gql`
  fragment ArenaPost on ArenaPost {
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
      location
    }
    deleted
  }
`;

export const arenaUserQuery = gql`
  query ArenaUser($username: String!) {
    arenaUser(username: $username) {
      ...ArenaUser
    }
  }
  ${arenaUserFragment}
`;

export const arenaCategoriesQuery = gql`
  query arenaPage {
    arenaCategories {
      ...ArenaCategories
    }
  }
  ${arenaCategoriesFragment}
`;

export const arenaCategoryQuery = gql`
  query arenaCategory($categoryId: Int!, $page: Int!) {
    arenaCategory(categoryId: $categoryId, page: $page) {
      ...ArenaCategory
      topics {
        ...ArenaTopic
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
      ...ArenaTopic
      posts {
        ...ArenaPost
      }
    }
  }
  ${arenaTopicFragment}
  ${arenaPostFragment}
`;

export const arenaTopicsByUserQuery = gql`
  query arenaTopicsByUser($userSlug: String!) {
    arenaTopicsByUser(userSlug: $userSlug) {
      ...ArenaTopic
    }
  }
  ${arenaTopicFragment}
`;

export const useArenaUser = (options: QueryHookOptions<GQLArenaUserQuery, GQLArenaUserQueryVariables>) => {
  const { data, loading } = useGraphQuery<GQLArenaUserQuery, GQLArenaUserQueryVariables>(arenaUserQuery, options);
  return { arenaUser: data?.arenaUser, loading };
};

const arenaRecentTopics = gql`
  query arenaRecentTopics {
    arenaRecentTopics {
      ...ArenaTopic
    }
  }
  ${arenaTopicFragment}
`;

export const useArenaCategories = (options: QueryHookOptions<GQLArenaPageQuery, GQLArenaPageQueryVariables>) => {
  const { data, loading, error } = useGraphQuery(arenaCategoriesQuery, options);
  return { arenaCategories: data?.arenaCategories, loading, error };
};

export const useArenaCategory = (options: QueryHookOptions<GQLArenaCategoryQuery, GQLArenaCategoryQueryVariables>) => {
  const { data, loading, error } = useGraphQuery(arenaCategoryQuery, options);
  return { arenaCategory: data?.arenaCategory, loading, error };
};

export const useArenaTopic = (options: QueryHookOptions<GQLArenaTopicByIdQuery, GQLArenaTopicByIdQueryVariables>) => {
  const { data, loading, error } = useGraphQuery(arenaTopicById, options);
  return { arenaTopic: data?.arenaTopic, loading, error };
};

const arenaNotificationFragment = gql`
  fragment ArenaNotification on ArenaNotification {
    __typename
    bodyShort
    datetimeISO
    from
    importance
    path
    read
    topicId
    postId
    notificationId
    topicTitle
    subject
    type
    user {
      displayName
      id
      slug
    }
  }
`;

export const arenaNotificationQuery = gql`
  query arenaNotifications {
    arenaNotifications {
      ...ArenaNotification
    }
  }
  ${arenaNotificationFragment}
`;

export const useArenaNotifications = (options?: QueryHookOptions<GQLArenaNotificationsQuery>) => {
  const { data, refetch, loading } = useGraphQuery<GQLArenaNotificationsQuery>(arenaNotificationQuery, {
    ...options,
    pollInterval: 60000,
    ssr: false,
    skip: !config.enableNodeBB,
  });
  return {
    notifications: data?.arenaNotifications,
    refetch,
    loading,
  };
};

export const useArenaTopicsByUser = (options: QueryHookOptions<GQLArenaTopicsByUserQuery>) => {
  const { data, loading, error } = useGraphQuery<GQLArenaTopicsByUserQuery>(arenaTopicsByUserQuery, options);
  return { arenaTopicsByUser: data?.arenaTopicsByUser, loading, error };
};

export const useRecentTopics = (options?: QueryHookOptions<GQLArenaRecentTopicsQuery>) => {
  const { data, ...rest } = useGraphQuery<GQLArenaRecentTopicsQuery>(arenaRecentTopics, options);
  return {
    data: data?.arenaRecentTopics,
    ...rest,
  };
};
