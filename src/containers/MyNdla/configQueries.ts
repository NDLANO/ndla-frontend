/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { GQLAiOrganizationsQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

export const configQuery = gql`
  query AiOrganizations {
    aiEnabledOrgs {
      key
      value
    }
  }
`;

export const useAiOrgs = () => {
  const { data } = useGraphQuery<GQLAiOrganizationsQuery>(configQuery);
  return { data };
};
