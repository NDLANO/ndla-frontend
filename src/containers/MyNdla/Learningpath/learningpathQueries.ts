/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql, useQuery } from "@apollo/client";
import { GQLMyLearningpathsQuery } from "../../../graphqlTypes";
import { learningpathFragment } from "./learningpathFragments";

const myLearningpathQuery = gql`
  query MyLearningpaths {
    myLearningpaths {
      ...MyNdlaLearningpath
    }
  }
  ${learningpathFragment}
`;

export const useMyLearningpaths = () => useQuery<GQLMyLearningpathsQuery>(myLearningpathQuery);
