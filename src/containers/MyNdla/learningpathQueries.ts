/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { GQLMyLearningpathsQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

export const myLearningpathFragment = gql`
  fragment MyLearningpath on Learningpath {
    id
    title
    description
    lastUpdated
    status
    coverphoto {
      url
    }
  }
`;

export const learningpathQuery = gql`
  query MyLearningpaths {
    myLearningpaths {
      ...MyLearningpath
    }
  }
  ${myLearningpathFragment}
`;

export const useMyLearningpaths = () => {
  const { data, loading } = useGraphQuery<GQLMyLearningpathsQuery>(learningpathQuery);
  return { data, loading };
};
