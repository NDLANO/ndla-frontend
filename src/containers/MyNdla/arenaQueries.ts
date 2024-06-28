/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { QueryHookOptions, gql } from "@apollo/client";
import {
  GQLArenaUserV2Query,
  GQLArenaUserV2QueryVariables,
  GQLArenaPage2Query,
  GQLArenaCategoryV2Query,
  GQLQueryArenaCategoryV2Args,
  GQLArenaTopicByIdV2Query,
  GQLArenaTopicByIdV2QueryVariables,
  GQLArenaRecentTopicsV2Query,
  GQLArenaPostInContextQuery,
  GQLArenaUsersQuery,
  GQLArenaNotificationsV2Query,
  GQLArenaTopicsByUserV2Query,
  GQLAllFlagsV2Query,
  GQLArenaPage2QueryVariables,
} from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const arenaUserFragment = gql`
  fragment ArenaUserV2 on ArenaUserV2 {
    displayName
    id
    groups
    location
    username
  }
`;

export const topiclessArenaCategoryV2Fragment = gql`
  fragment TopiclessArenaCategoryV2 on TopiclessArenaCategoryV2 {
    __typename
    id
    title
    description
    topicCount
    postCount
    visible
    isFollowing
    parentCategoryId
    breadcrumbs {
      id
      title
    }
  }
`;

export const arenaCategoryV2Fragment = gql`
  fragment ArenaCategoryV2 on ArenaCategoryV2 {
    __typename
    id
    title
    description
    topicCount
    postCount
    visible
    isFollowing
    parentCategoryId
    breadcrumbs {
      id
      title
    }
    subcategories {
      ...TopiclessArenaCategoryV2
      subcategories {
        ...TopiclessArenaCategoryV2
        subcategories {
          ...TopiclessArenaCategoryV2
          subcategories {
            ...TopiclessArenaCategoryV2
            subcategories {
              ...TopiclessArenaCategoryV2
              subcategories {
                ...TopiclessArenaCategoryV2
                subcategories {
                  ...TopiclessArenaCategoryV2
                  subcategories {
                    ...TopiclessArenaCategoryV2
                    subcategories {
                      ...TopiclessArenaCategoryV2
                      subcategories {
                        ...TopiclessArenaCategoryV2
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${topiclessArenaCategoryV2Fragment}
`;

export const arenaTopicV2Fragment = gql`
  fragment ArenaTopicV2 on ArenaTopicV2 {
    __typename
    id
    postCount
    created
    updated
    title
    isFollowing
    categoryId
    isLocked
  }
`;

export const arenaFlagFragment = gql`
  fragment ArenaFlag on ArenaFlag {
    __typename
    id
    reason
    created
    resolved
    isResolved
    flagger {
      ...ArenaUserV2
    }
  }
  ${arenaUserFragment}
`;

export const arenaPostV2Fragment = gql`
  fragment ArenaPostV2 on ArenaPostV2 {
    __typename
    content
    contentAsHTML
    id
    created
    updated
    topicId
    upvotes
    upvoted
    owner {
      ...ArenaUserV2
    }
    flags {
      ...ArenaFlag
    }
  }
  ${arenaFlagFragment}
  ${arenaUserFragment}
`;

export const arenaPaginatedPostsV2Fragment = gql`
  fragment PaginatedPosts on PaginatedPosts {
    __typename
    totalCount
    page
    pageSize
    items {
      ...ArenaPostV2
    }
  }
  ${arenaPostV2Fragment}
`;

export const arenaPaginatedTopicsV2Fragment = gql`
  fragment PaginatedTopics on PaginatedTopics {
    __typename
    totalCount
    page
    pageSize
    items {
      ...ArenaTopicV2
    }
  }
  ${arenaTopicV2Fragment}
`;

export const arenaUserQuery = gql`
  query ArenaUserV2($username: String!) {
    arenaUserV2(username: $username) {
      ...ArenaUserV2
    }
  }
  ${arenaUserFragment}
`;

export const arenaCategoriesV2Query = gql`
  query arenaPage2 {
    arenaCategoriesV2 {
      ...ArenaCategoryV2
    }
  }
  ${arenaCategoryV2Fragment}
`;

export const arenaCategoryV2Query = gql`
  query arenaCategoryV2($categoryId: Int!, $page: Int!) {
    arenaCategoryV2(categoryId: $categoryId, page: $page) {
      ...ArenaCategoryV2
      topics {
        ...ArenaTopicV2
      }
      subcategories {
        ...TopiclessArenaCategoryV2
      }
    }
  }
  ${topiclessArenaCategoryV2Fragment}
  ${arenaCategoryV2Fragment}
  ${arenaTopicV2Fragment}
`;

export const arenaTopicByIdV2 = gql`
  query arenaTopicByIdV2($topicId: Int!, $page: Int!, $pageSize: Int!) {
    arenaTopicV2(topicId: $topicId, page: $page, pageSize: $pageSize) {
      ...ArenaTopicV2
      posts {
        ...PaginatedPosts
      }
    }
  }
  ${arenaTopicV2Fragment}
  ${arenaPaginatedPostsV2Fragment}
`;

export const arenaTopicsByUserV2Query = gql`
  query arenaTopicsByUserV2($userId: Int!) {
    arenaTopicsByUserV2(userId: $userId) {
      ...PaginatedTopics
    }
  }
  ${arenaPaginatedTopicsV2Fragment}
`;

export const useArenaUser = (options: QueryHookOptions<GQLArenaUserV2Query, GQLArenaUserV2QueryVariables>) => {
  const { data, loading } = useGraphQuery<GQLArenaUserV2Query, GQLArenaUserV2QueryVariables>(arenaUserQuery, options);
  return { arenaUser: data?.arenaUserV2, loading };
};

const arenaRecentTopics = gql`
  query arenaRecentTopicsV2($pageSize: Int!) {
    arenaRecentTopicsV2(pageSize: $pageSize) {
      ...PaginatedTopics
    }
  }
  ${arenaPaginatedTopicsV2Fragment}
`;

export const useArenaCategoriesV2 = (options: QueryHookOptions<GQLArenaPage2Query, GQLArenaPage2QueryVariables>) => {
  const { data, loading, error, refetch } = useGraphQuery(arenaCategoriesV2Query, options);
  return { arenaCategories: data?.arenaCategoriesV2, loading, error, refetch };
};

export const useArenaCategory = (options: QueryHookOptions<GQLArenaCategoryV2Query, GQLQueryArenaCategoryV2Args>) => {
  const { data, loading, error, refetch } = useGraphQuery(arenaCategoryV2Query, options);
  return { arenaCategory: data?.arenaCategoryV2, loading, error, refetch };
};

export const useArenaTopic = (
  options: QueryHookOptions<GQLArenaTopicByIdV2Query, GQLArenaTopicByIdV2QueryVariables>,
) => {
  const { data, loading, error } = useGraphQuery(arenaTopicByIdV2, options);
  return { arenaTopic: data?.arenaTopicV2, loading, error };
};

const arenaNotificationFragment = gql`
  fragment ArenaNotificationV2 on ArenaNewPostNotificationV2 {
    __typename
    id
    topicId
    topicTitle
    notificationTime
    isRead
    post {
      ...ArenaPostV2
    }
  }
  ${arenaPostV2Fragment}
`;

const arenaPaginatedNotificationsFragment = gql`
  fragment PaginatedNotifications on PaginatedArenaNewPostNotificationV2 {
    __typename
    totalCount
    page
    pageSize
    items {
      ...ArenaNotificationV2
    }
  }
  ${arenaNotificationFragment}
`;

export const arenaNotificationV2Query = gql`
  query arenaNotificationsV2 {
    arenaNotificationsV2 {
      ...PaginatedNotifications
    }
  }
  ${arenaPaginatedNotificationsFragment}
`;

export const useArenaNotifications = (options?: QueryHookOptions<GQLArenaNotificationsV2Query>) => {
  const { data, refetch, loading } = useGraphQuery<GQLArenaNotificationsV2Query>(arenaNotificationV2Query, {
    ...options,
    pollInterval: 60000,
    ssr: false,
  });
  return {
    loading,
    notifications: data?.arenaNotificationsV2,
    refetch,
  };
};

export const arenaFlagV2Query = gql`
  query allFlagsV2($pageSize: Int, $page: Int) {
    arenaAllFlags(pageSize: $pageSize, page: $page) {
      ...PaginatedPosts
    }
  }
  ${arenaPaginatedPostsV2Fragment}
`;

export const arenaPostInContextQuery = gql`
  query arenaPostInContext($postId: Int!, $pageSize: Int) {
    arenaPostInContext(postId: $postId, pageSize: $pageSize) {
      ...ArenaTopicV2
      posts {
        ...PaginatedPosts
      }
    }
  }
  ${arenaTopicV2Fragment}
  ${arenaPaginatedPostsV2Fragment}
`;

const arenaUsersQuery = gql`
  query arenaUsers($query: String, $filterTeachers: Boolean, $page: Int!, $pageSize: Int!) {
    listArenaUserV2(pageSize: $pageSize, page: $page, query: $query, filterTeachers: $filterTeachers) {
      __typename
      page
      pageSize
      totalCount
      items {
        ...ArenaUserV2
      }
    }
  }
  ${arenaUserFragment}
`;

export const useArenaPostInContext = (options: QueryHookOptions<GQLArenaPostInContextQuery>) => {
  const { data, loading, error } = useGraphQuery<GQLArenaPostInContextQuery>(arenaPostInContextQuery, options);
  return { topic: data?.arenaPostInContext, loading, error };
};

export const useArenaFlags = (options?: QueryHookOptions<GQLAllFlagsV2Query>) => {
  const { data, loading, error } = useGraphQuery<GQLAllFlagsV2Query>(arenaFlagV2Query, options);
  return { arenaAllFlags: data?.arenaAllFlags, loading, error };
};

export const useArenaUsers = (options?: QueryHookOptions<GQLArenaUsersQuery>) => {
  const { data, loading, error } = useGraphQuery<GQLArenaUsersQuery>(arenaUsersQuery, options);

  return { users: data?.listArenaUserV2, loading, error };
};

export const useArenaTopicsByUser = (options: QueryHookOptions<GQLArenaTopicsByUserV2Query>) => {
  const { data, loading, error } = useGraphQuery<GQLArenaTopicsByUserV2Query>(arenaTopicsByUserV2Query, options);
  return { arenaTopicsByUser: data?.arenaTopicsByUserV2, loading, error };
};

export const useArenaRecentTopics = (options?: QueryHookOptions<GQLArenaRecentTopicsV2Query>) => {
  const { data, ...rest } = useGraphQuery<GQLArenaRecentTopicsV2Query>(arenaRecentTopics, options);
  return {
    data: data?.arenaRecentTopicsV2,
    ...rest,
  };
};
