/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { MouseEvent } from 'react';
//@ts-ignore
import { Spinner } from '@ndla/ui';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
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
    e: MouseEvent<HTMLAnchorElement>,
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
    />
  );
};
