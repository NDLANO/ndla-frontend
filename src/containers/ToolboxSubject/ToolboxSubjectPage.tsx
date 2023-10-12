/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { ContentPlaceholder } from '@ndla/ui';
import { useUrnIds } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLToolboxSubjectPageQuery,
  GQLToolboxSubjectPageQueryVariables,
} from '../../graphqlTypes';
import ToolboxSubjectContainer, {
  toolboxSubjectContainerFragments,
} from './ToolboxSubjectContainer';

const toolboxSubjectPageQuery = gql`
  query toolboxSubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      ...ToolboxSubjectContainer_Subject
    }
  }
  ${toolboxSubjectContainerFragments.subject}
`;
const ToolboxSubjectPage = () => {
  const { subjectId, topicList } = useUrnIds();

  const { loading, data } = useGraphQuery<
    GQLToolboxSubjectPageQuery,
    GQLToolboxSubjectPageQueryVariables
  >(toolboxSubjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return <ContentPlaceholder />;
  }

  if (!data?.subject) {
    return <DefaultErrorMessage />;
  }

  return (
    <main>
      <ToolboxSubjectContainer subject={data.subject} topicList={topicList} />
    </main>
  );
};

export default ToolboxSubjectPage;
