/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useQuery } from "@apollo/client";
import { GQLAiOrganizationsQuery } from "../../graphqlTypes";

export const configQuery = gql`
  query AiOrganizations {
    aiEnabledOrgs {
      key
      value
    }
  }
`;

export const useAiOrgs = () => {
  const { data } = useQuery<GQLAiOrganizationsQuery>(configQuery);
  return { data };
};
