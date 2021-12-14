/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { getUrnIdsFromProps } from '../../routeHelpers';
import { useGraphQuery } from '../../util/runQueries';
import { subjectPageQuery } from '../../queries';
import DefaultErrorMessage from '../../components/DefaultErrorMessage';
import {
  GQLSubjectPageQuery,
  GQLSubjectPageQueryVariables,
} from '../../graphqlTypes';
import ToolboxSubjectContainer from './ToolboxSubjectContainer';
import { RootComponentProps } from '../../routes';

interface Props extends RootComponentProps, RouteComponentProps {}

const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const { loading, data } = useGraphQuery<
    GQLSubjectPageQuery,
    GQLSubjectPageQueryVariables
  >(subjectPageQuery, {
    variables: {
      subjectId: subjectId!,
    },
  });

  if (loading) {
    return null;
  }

  if (!data?.subject) {
    return <DefaultErrorMessage />;
  }

  return (
    <ToolboxSubjectContainer
      subject={data.subject}
      topicList={topicList}
      locale={locale}
    />
  );
};

export default withRouter(ToolboxSubjectPage);
