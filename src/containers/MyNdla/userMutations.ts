/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useApolloClient, useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import {
  GQLPersonalDataQuery,
  GQLUpdatePersonalDataMutation,
  GQLUpdatePersonalDataMutationVariables,
} from '../../graphqlTypes';

const deletePersonalDataMutation = gql`
  mutation deletePersonalData {
    deletePersonalData
  }
`;

export const useDeletePersonalData = () => {
  const client = useApolloClient();
  const [deletePersonalData] = useMutation<boolean>(
    deletePersonalDataMutation,
    {
      onCompleted: () => client.resetStore(),
    },
  );

  return { deletePersonalData };
};

const personalDataQueryFragment = gql`
  fragment MySubjectMyNdlaPersonalDataFragment on MyNdlaPersonalData {
    id
    favoriteSubjects
    role
  }
`;

const personalDataQuery = gql`
  query personalData {
    personalData {
      ...MySubjectMyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

export const usePersonalData = () => {
  const [fetch, { data, loading }] =
    useLazyQuery<GQLPersonalDataQuery>(personalDataQuery);
  const personalData = data?.personalData;
  return { personalData, loading, fetch };
};

const updatePersonalDataQuery = gql`
  mutation updatePersonalData($favoriteSubjects: [String!]!) {
    updatePersonalData(favoriteSubjects: $favoriteSubjects) {
      ...MySubjectMyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

export const useUpdatePersonalData = () => {
  const { cache } = useApolloClient();
  const [updatePersonalData, { loading }] = useMutation<
    GQLUpdatePersonalDataMutation,
    GQLUpdatePersonalDataMutationVariables
  >(updatePersonalDataQuery, {
    onCompleted: (data) => {
      cache.modify({
        id: cache.identify({
          __ref: data.__typename,
        }),
        fields: {
          personalData() {
            return data.updatePersonalData;
          },
        },
      });
    },
  });
  return { updatePersonalData, loading };
};
