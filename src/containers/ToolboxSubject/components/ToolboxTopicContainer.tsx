/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext, MouseEvent } from 'react';
import { Spinner } from '@ndla/ui';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import { AuthContext } from '../../../components/AuthenticationContext';
import {
  GQLToolboxTopicContainerQuery,
  GQLToolboxTopicContainerQueryVariables,
  GQLToolboxTopicContainer_SubjectFragment,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import { useGraphQuery } from '../../../util/runQueries';
import ToolboxTopicWrapper, {
  toolboxTopicWrapperFragments,
} from './ToolboxTopicWrapper';

interface Props {
  subject: GQLToolboxTopicContainer_SubjectFragment;
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

const toolboxTopicContainerQuery = gql`
  query toolboxTopicContainer($topicId: String!, $subjectId: String!) {
    topic(id: $topicId, subjectId: $subjectId) {
      id # This query recursively calls itself if ID is not included here. Not sure why.
      ...ToolboxTopicWrapper_Topic
    }
    resourceTypes {
      ...ToolboxTopicWrapper_ResourceTypeDefinition
    }
  }
  ${toolboxTopicWrapperFragments.resourceType}
  ${toolboxTopicWrapperFragments.topic}
`;

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
    GQLToolboxTopicContainerQuery,
    GQLToolboxTopicContainerQueryVariables
  >(toolboxTopicContainerQuery, {
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

ToolboxTopicContainer.fragments = {
  subject: gql`
    fragment ToolboxTopicContainer_Subject on Subject {
      ...ToolboxTopicWrapper_Subject
    }
    ${toolboxTopicWrapperFragments.subject}
  `,
};
