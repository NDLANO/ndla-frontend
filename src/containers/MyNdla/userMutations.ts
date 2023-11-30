/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useApolloClient, useMutation, gql } from '@apollo/client';
import {
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
    arenaEnabled
    shareName
  }
`;

const updatePersonalDataQuery = gql`
  mutation updatePersonalData(
    $favoriteSubjects: [String!]
    $shareName: Boolean
  ) {
    updatePersonalData(
      favoriteSubjects: $favoriteSubjects
      shareName: $shareName
    ) {
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
