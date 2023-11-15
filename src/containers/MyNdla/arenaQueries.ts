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
  GQLMarkNotificationReadMutation,
  GQLMutationMarkNotificationReadArgs,
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
    bodyShort
    datetimeISO
    from
    importance
    path
    read
    tid
    pid
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
  const { loading, data } = useGraphQuery<GQLArenaNotificationsQuery>(
    arenaNotificationQuery,
  );
  return { notifications: data?.arenaNotifications, loading };
};

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkNotificationRead($topicId: Int!) {
    markNotificationRead(topicId: $topicId)
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationRead, { loading }] = useMutation<
    GQLMarkNotificationReadMutation,
    GQLMutationMarkNotificationReadArgs
  >(arenaMarkNotificationAsReadMutation);
  return { markNotificationRead, loading };
};
