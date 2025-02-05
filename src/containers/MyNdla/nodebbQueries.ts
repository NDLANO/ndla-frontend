/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { QueryHookOptions, gql, useQuery } from "@apollo/client";
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
export const arenaChildCategoryFragment = gql`
  fragment ArenaCategoryChild on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    topicCount
    voteCount
    slug
    parentCategoryId
    breadcrumbs {
      id
      title
    }
  }
`;

export const arenaCategoriesFragment = gql`
  fragment ArenaCategory on ArenaCategory {
    __typename
    description
    disabled
    htmlDescription
    id
    name
    topicCount
    voteCount
    slug
    parentCategoryId
    children {
      ...ArenaCategoryChild
      children {
        ...ArenaCategoryChild
        children {
          ...ArenaCategoryChild
          children {
            ...ArenaCategoryChild
            children {
              ...ArenaCategoryChild
              children {
                ...ArenaCategoryChild
              }
            }
          }
        }
      }
    }
    breadcrumbs {
      id
      title
    }
  }
  ${arenaChildCategoryFragment}
`;

export const arenaTopicFragment = gql`
  fragment ArenaTopic on ArenaTopic {
    __typename
    categoryId
    id
    locked
    postCount
    voteCount
    slug
    timestamp
    title
    deleted
    isFollowing
  }
`;

export const arenaRepliesFragment = gql`
  fragment ArenaReplies on ArenaPost {
    __typename
    content
    id
    timestamp
    topicId
    isMainPost
    user {
      id
      displayName
      profilePicture
      username
      location
    }
    deleted
    toPid
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
      id
      displayName
      profilePicture
      username
      location
    }
    upvotes
    upvoted
    deleted
    toPid
    replies {
      ...ArenaReplies
    }
  }
  ${arenaRepliesFragment}
`;

export const arenaUserQuery = gql`
  query ArenaUser($id: Int!) {
    arenaUserById(id: $id) {
      ...ArenaUser
    }
  }
  ${arenaUserFragment}
`;

export const arenaCategoriesQuery = gql`
  query arenaPage {
    arenaCategories {
      ...ArenaCategory
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
  ${arenaCategoriesFragment}
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
  const { data, loading } = useQuery<GQLArenaUserQuery, GQLArenaUserQueryVariables>(arenaUserQuery, options);
  return { arenaUser: data?.arenaUserById, loading };
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
  const { data, loading, error, refetch } = useQuery<GQLArenaPageQuery, GQLArenaPageQueryVariables>(
    arenaCategoriesQuery,
    options,
  );
  return { arenaCategories: data?.arenaCategories, loading, error, refetch };
};

export const useArenaCategory = (options: QueryHookOptions<GQLArenaCategoryQuery, GQLArenaCategoryQueryVariables>) => {
  const { data, loading, error } = useQuery<GQLArenaCategoryQuery, GQLArenaCategoryQueryVariables>(
    arenaCategoryQuery,
    options,
  );
  return { arenaCategory: data?.arenaCategory, loading, error };
};

export const useArenaTopic = (options: QueryHookOptions<GQLArenaTopicByIdQuery, GQLArenaTopicByIdQueryVariables>) => {
  const { data, loading, error } = useQuery<GQLArenaTopicByIdQuery, GQLArenaTopicByIdQueryVariables>(
    arenaTopicById,
    options,
  );
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
  const { data, refetch, loading } = useQuery<GQLArenaNotificationsQuery>(arenaNotificationQuery, {
    ...options,
    pollInterval: 60000,
    ssr: false,
  });
  return {
    notifications: data?.arenaNotifications,
    refetch,
    loading,
  };
};

export const useArenaTopicsByUser = (options: QueryHookOptions<GQLArenaTopicsByUserQuery>) => {
  const { data, loading, error } = useQuery<GQLArenaTopicsByUserQuery>(arenaTopicsByUserQuery, options);
  return { arenaTopicsByUser: data?.arenaTopicsByUser, loading, error };
};

export const useRecentTopics = (options?: QueryHookOptions<GQLArenaRecentTopicsQuery>) => {
  const { data, ...rest } = useQuery<GQLArenaRecentTopicsQuery>(arenaRecentTopics, options);
  return {
    data: data?.arenaRecentTopics,
    ...rest,
  };
};
