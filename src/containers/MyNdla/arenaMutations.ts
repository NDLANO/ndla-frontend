/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useApolloClient, useMutation } from '@apollo/client';
import {
  GQLMarkNotificationAsReadMutation,
  GQLMarkNotificationAsReadMutationVariables,
  GQLMutationNewFlagArgs,
  GQLMutationSubscribeToTopicArgs,
  GQLMutationUnsubscribeFromTopicArgs,
  GQLNewFlagMutation,
  GQLSubscribeToTopicMutation,
  GQLUnsubscribeFromTopicMutation,
} from '../../graphqlTypes';
import { arenaNotificationQuery } from './arenaQueries';

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

const arenaMarkNotificationAsReadMutation = gql`
  mutation MarkNotificationAsRead($topicIds: [Int!]!) {
    markNotificationAsRead(topicIds: $topicIds)
  }
`;

export const useMarkNotificationsAsRead = () => {
  const [markNotificationsAsRead] = useMutation<
    GQLMarkNotificationAsReadMutation,
    GQLMarkNotificationAsReadMutationVariables
  >(arenaMarkNotificationAsReadMutation, {
    refetchQueries: [{ query: arenaNotificationQuery }],
  });
  return { markNotificationsAsRead };
};

const subscribeToTopicMutation = gql`
  mutation subscribeToTopic($topicId: Int!) {
    subscribeToTopic(topicId: $topicId)
  }
`;

export const useSubscribeToTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<
    GQLSubscribeToTopicMutation,
    GQLMutationSubscribeToTopicArgs
  >(subscribeToTopicMutation, {
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __typename: 'ArenaTopic',
          id: data.subscribeToTopic,
        }),
        fields: {
          isFollowing: () => true,
        },
      });
    },
  });
};

const unsubscribeFromTopicMutation = gql`
  mutation unsubscribeFromTopic($topicId: Int!) {
    unsubscribeFromTopic(topicId: $topicId)
  }
`;

export const useUnsubscribeFromTopicMutation = () => {
  const { cache } = useApolloClient();
  return useMutation<
    GQLUnsubscribeFromTopicMutation,
    GQLMutationUnsubscribeFromTopicArgs
  >(unsubscribeFromTopicMutation, {
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __typename: 'ArenaTopic',
          id: data.unsubscribeFromTopic,
        }),
        fields: {
          isFollowing: () => false,
        },
      });
    },
  });
};
