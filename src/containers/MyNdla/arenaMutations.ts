/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useMutation } from '@apollo/client';
import { GQLMutationNewFlagArgs, GQLNewFlagMutation } from '../../graphqlTypes';

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
