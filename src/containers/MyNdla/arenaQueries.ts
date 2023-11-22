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
  GQLArenaUser,
  GQLMarkNotificationAsReadMutation,
  GQLMutationMarkNotificationAsReadArgs,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

const arenaUserFragment = gql`
  fragment ArenaUserQueryFragment on ArenaUser {
    displayName
    id
    profilePicture
    slug
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

export const useArenaUser = (username: string) => {
  const { data } = useGraphQuery<GQLArenaUser>(arenaUserQuery, {
    variables: { username },
  });
  return { arenaUser: data };
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
      ...ArenaUserQueryFragment
    }
  }
  ${arenaUserFragment}
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
      pollInterval: 600000,
    },
  );
  return {
    notifications: data?.arenaNotifications,
  };
};

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkNotificationAsRead($topicId: Int!) {
    markNotificationAsRead(topicId: $topicId)
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationAsRead] = useMutation<
    GQLMarkNotificationAsReadMutation,
    GQLMutationMarkNotificationAsReadArgs
  >(arenaMarkNotificationAsReadMutation, {
    refetchQueries: [{ query: arenaNotificationQuery }],
  });
  return { markNotificationAsRead };
};
