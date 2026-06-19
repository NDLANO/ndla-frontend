/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { GQLUpdatePersonalDataMutation, GQLUpdatePersonalDataMutationVariables } from "../graphqlTypes";

const deletePersonalDataMutation = gql`
  mutation deletePersonalData {
    deletePersonalData
  }
`;

export const useDeletePersonalData = () => {
  const client = useApolloClient();
  const [deletePersonalData] = useMutation<boolean>(deletePersonalDataMutation, {
    onCompleted: () => client.clearStore(),
  });

  return { deletePersonalData };
};

const personalDataQueryFragment = gql`
  fragment MySubjectMyNdlaPersonalDataFragment on MyNdlaPersonalData {
    __typename
    id
    favoriteSubjects
    role
    arenaEnabled
  }
`;

const updatePersonalDataQuery = gql`
  mutation updatePersonalData($favoriteSubjects: [String!]) {
    updatePersonalData(favoriteSubjects: $favoriteSubjects) {
      ...MySubjectMyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

export const useUpdatePersonalData = () => {
  const [updatePersonalData, { loading }] = useMutation<
    GQLUpdatePersonalDataMutation,
    GQLUpdatePersonalDataMutationVariables
  >(updatePersonalDataQuery);
  return { updatePersonalData, loading };
};
