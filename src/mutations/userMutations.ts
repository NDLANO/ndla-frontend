/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, TypedDocumentNode } from "@apollo/client";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { GQLUpdatePersonalDataMutation, GQLUpdatePersonalDataMutationVariables } from "../graphqlTypes";

const deletePersonalDataMutation: TypedDocumentNode<boolean> = gql`
  mutation deletePersonalData {
    deletePersonalData
  }
`;

export const useDeletePersonalData = () => {
  const client = useApolloClient();
  const [deletePersonalData] = useMutation(deletePersonalDataMutation, {
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

const updatePersonalDataQuery: TypedDocumentNode<
  GQLUpdatePersonalDataMutation,
  GQLUpdatePersonalDataMutationVariables
> = gql`
  mutation updatePersonalData($favoriteSubjects: [String!]) {
    updatePersonalData(favoriteSubjects: $favoriteSubjects) {
      ...MySubjectMyNdlaPersonalDataFragment
    }
  }
  ${personalDataQueryFragment}
`;

export const useUpdatePersonalData = () => {
  const [updatePersonalData, { loading }] = useMutation(updatePersonalDataQuery);
  return { updatePersonalData, loading };
};
