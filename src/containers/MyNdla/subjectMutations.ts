import gql from 'graphql-tag';
import {
  GQLMySubjectsQuery,
  GQLMySubjectsSubjectFramgentFragment,
} from '../../graphqlTypes';
import { useGraphQuery } from '../../util/runQueries';

const subjectsQueryFragment = gql`
  fragment MySubjectsSubjectFramgent on Subject {
    id
    name
  }
`;

const subjectsQuery = gql`
  query allSubjects($ids: [String!]) {
    subjects(ids: $ids) {
      ...MySubjectsSubjectFramgent
    }
  }
  ${subjectsQueryFragment}
`;

export const useSubjects = (ids?: string[]) => {
  const { data, loading, error } = useGraphQuery<GQLMySubjectsQuery>(
    subjectsQuery,
    {
      variables: {
        ids,
      },
    },
  );
  const subjects =
    data?.subjects || ([] as GQLMySubjectsSubjectFramgentFragment[]);
  return { subjects, loading, error };
};
