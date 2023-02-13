/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext } from 'react';
import { Spinner } from '@ndla/icons';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import { AuthContext } from '../../../components/AuthenticationContext';
import {
  GQLToolboxTopicContainerQuery,
  GQLToolboxTopicContainerQueryVariables,
  GQLToolboxTopicContainer_SubjectFragment,
} from '../../../graphqlTypes';
import { useGraphQuery } from '../../../util/runQueries';
import ToolboxTopicWrapper, {
  toolboxTopicWrapperFragments,
} from './ToolboxTopicWrapper';
import config from '../../../config';

interface Props {
  subject: GQLToolboxTopicContainer_SubjectFragment;
  topicId: string;
  topicList: Array<string>;
  index: number;
}

const toolboxTopicContainerQuery = gql`
  query toolboxTopicContainer(
    $topicId: String!
    $subjectId: String!
    $convertEmbeds: Boolean
  ) {
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
      convertEmbeds: !config.articleConverterEnabled,
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
