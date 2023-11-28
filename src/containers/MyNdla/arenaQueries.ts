/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useMutation } from '@apollo/client';
import {
  GQLArenaNotificationsQuery,
  GQLArenaUserQuery,
  GQLMarkNotificationAsReadMutation,
  GQLMutationMarkNotificationAsReadArgs,
  GQLArenaPageQuery,
  GQLArenaCategoryQuery,
  GQLArenaTopicByIdQuery,
  GQLArenaTopicByIdQueryVariables,
  GQLArenaCategoryQueryVariables,
  GQLArenaUserQueryVariables,
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

const arenaNotificationFragment = gql`
  fragment ArenaNotificationFragment on ArenaNotification {
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
      profilePicture
      slug
    }
  }
`;

const arenaNotificationQuery = gql`
  query arenaNotifications {
    arenaNotifications {
      ...ArenaNotificationFragment
    }
  }
  ${arenaNotificationFragment}
`;

export const useArenaNotifications = () => {
  const { data } = useGraphQuery<GQLArenaNotificationsQuery>(
    arenaNotificationQuery,
    {
      pollInterval: 60000,
      ssr: false,
      nextFetchPolicy: 'no-cache',
    },
  );
  return {
    notifications: data?.arenaNotifications,
  };
};

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkNotificationAsRead($topicIds: [Int!]!) {
    markNotificationAsRead(topicIds: $topicIds)
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationsAsRead] = useMutation<
    GQLMarkNotificationAsReadMutation,
    GQLMutationMarkNotificationAsReadArgs
  >(arenaMarkNotificationAsReadMutation, {
    refetchQueries: [{ query: arenaNotificationQuery }],
  });
  return { markNotificationsAsRead };
};
