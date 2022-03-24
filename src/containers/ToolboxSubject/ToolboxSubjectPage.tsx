/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { ContentPlaceholder } from '@ndla/ui';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import { AuthContext } from '../../components/AuthenticationContext';
import {
  GQLToolboxSubjectPageQuery,
  GQLToolboxSubjectPageQueryVariables,
} from '../../graphqlTypes';
import ToolboxSubjectContainer, {
  toolboxSubjectContainerFragments,
} from './ToolboxSubjectContainer';
import { RootComponentProps } from '../../routes';

interface Props extends RootComponentProps, RouteComponentProps {}

const toolboxSubjectPageQuery = gql`
  query toolboxSubjectPage($subjectId: String!) {
    subject(id: $subjectId) {
      ...ToolboxSubjectContainer_Subject
    }
  }
  ${toolboxSubjectContainerFragments.subject}
`;
const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { user } = useContext(AuthContext);
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

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
    <ToolboxSubjectContainer
      subject={data.subject}
      topicList={topicList}
      locale={locale}
      user={user}
    />
  );
};

export default withRouter(ToolboxSubjectPage);
