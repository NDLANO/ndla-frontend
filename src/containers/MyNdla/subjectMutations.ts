import gql from 'graphql-tag';
import {
  GQLMySubjectsSubjectFragmentFragment,
  GQLSubjectsQuery,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

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
  query allSubjects($ids: [String!]) {
    subjects(ids: $ids) {
      ...MySubjectsSubjectFragment
    }
  }
  ${subjectsQueryFragment}
`;

export const useSubjects = (ids?: string[]) => {
  const { data, loading, error } = useGraphQuery<GQLSubjectsQuery>(
    subjectsQuery,
    {
      variables: {
        ids,
      },
    },
  );
  const subjects =
    data?.subjects || ([] as GQLMySubjectsSubjectFragmentFragment[]);
  return { subjects, loading, error };
};
