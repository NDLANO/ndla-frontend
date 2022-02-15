/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React, { useContext } from 'react';
import { Spinner } from '@ndla/ui';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import { AuthContext } from '../../../components/AuthenticationContext';
import {
  GQLSubject,
  GQLTopicQuery,
  GQLTopicQueryVariables,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ToolboxTopicWrapper from './ToolboxTopicWrapper';

interface Props {
  subject: GQLSubject;
  topicId: string;
  locale: LocaleType;
  onSelectTopic: (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => void;
  topicList: Array<string>;
  index: number;
}

export const ToolboxTopicContainer = ({
  subject,
  topicId,
  locale,
  onSelectTopic,
  topicList,
  index,
}: Props) => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useGraphQuery<
    GQLTopicQuery,
    GQLTopicQueryVariables
  >(topicQuery, {
    variables: {
      subjectId: subject.id,
      topicId,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic) {
    return <DefaultErrorMessage />;
  }
  return (
    <ToolboxTopicWrapper
      subject={subject}
      loading={loading}
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      locale={locale}
      onSelectTopic={onSelectTopic}
      topicList={topicList}
      index={index}
      user={user}
    />
  );
};
