/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { GQLSubjectsQuery } from "../../graphqlTypes";
import { useGraphQuery } from "../../util/runQueries";

const subjectsQueryFragment = gql`
  fragment MySubjectsSubjectFragment on Subject {
    id
    name
    metadata {
      customFields
    }
  }
`;

const subjectsQuery = gql`
  query allSubjects {
    subjects(filterVisible: true) {
      ...MySubjectsSubjectFragment
    }
  }
  ${subjectsQueryFragment}
`;

export const useSubjects = () => {
  const { data, loading, error } = useGraphQuery<GQLSubjectsQuery>(subjectsQuery);
  return { subjects: data?.subjects, loading, error };
};
