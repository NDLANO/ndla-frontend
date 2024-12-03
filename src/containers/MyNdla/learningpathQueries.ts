/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { GQLMyLearningpathsQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

export const learningpathFragment = gql`
  fragment Learningpath on Learningpath {
    id
    title
    description
    created
    status
    madeAvailable
    coverphoto {
      url
    }
  }
`;

const myLearningpathQuery = gql`
  query MyLearningpaths {
    myLearningpaths {
      ...Learningpath
    }
  }
  ${learningpathFragment}
`;

export const useMyLearningpaths = () => useGraphQuery<GQLMyLearningpathsQuery>(myLearningpathQuery);
