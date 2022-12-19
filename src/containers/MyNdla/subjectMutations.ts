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
  query allSubjects {
    subjects {
      ...MySubjectsSubjectFragment
    }
  }
  ${subjectsQueryFragment}
`;

export const useSubjects = () => {
  const { data, loading, error } = useGraphQuery<GQLSubjectsQuery>(
    subjectsQuery,
  );
  const subjects =
    data?.subjects || ([] as GQLMySubjectsSubjectFragmentFragment[]);
  return { subjects, loading, error };
};
