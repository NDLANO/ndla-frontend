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
import { GQLTopic, GQLSubject } from '../../graphqlTypes';
import { LocaleType } from '../../interfaces';
import ToolboxSubjectContainer from './ToolboxSubjectContainer';

interface Props extends RouteComponentProps {
  locale: LocaleType;
}

interface Data {
  subject: GQLSubject & { allTopics: GQLTopic[] };
}

const ToolboxSubjectPage = ({ match, locale }: Props) => {
  const { subjectId, topicList } = getUrnIdsFromProps({
    ndlaFilm: false,
    match,
  });

  const { loading, data } = useGraphQuery<Data>(subjectPageQuery, {
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
      data={data}
      topicList={topicList}
      locale={locale}
    />
  );
};

export default withRouter(ToolboxSubjectPage);
