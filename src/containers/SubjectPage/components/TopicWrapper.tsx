import { gql } from '@apollo/client';
import { Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@ndla/icons';
import { SimpleBreadcrumbItem } from '@ndla/ui';
import Topic, { topicFragments } from './Topic';
import { useGraphQuery } from '../../../util/runQueries';
import handleError, { isAccessDeniedError } from '../../../util/handleError';
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_SubjectFragment,
} from '../../../graphqlTypes';
import { removeUrn } from '../../../routeHelpers';

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  setBreadCrumb: Dispatch<SetStateAction<SimpleBreadcrumbItem[]>>;
  index: number;
  showResources: boolean;
  subject: GQLTopicWrapper_SubjectFragment;
};

const topicWrapperQuery = gql`
  query topicWrapper(
    $topicId: String!
    $subjectId: String
    $convertEmbeds: Boolean
  ) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      ...Topic_Topic
    }
    resourceTypes {
      ...Topic_ResourceTypeDefinition
    }
  }
  ${topicFragments.topic}
  ${topicFragments.resourceType}
`;

const TopicWrapper = ({
  subTopicId,
  topicId,
  subjectId,
  setBreadCrumb,
  showResources,
  subject,
  index,
}: Props) => {
  const navigate = useNavigate();
  const { data, loading, error } = useGraphQuery<
    GQLTopicWrapperQuery,
    GQLTopicWrapperQueryVariables
  >(topicWrapperQuery, {
    variables: {
      topicId,
      subjectId,
      convertEmbeds: true,
    },
    onCompleted: (data) => {
      const topic = data.topic;
      if (topic) {
        setBreadCrumb((crumbs) =>
          crumbs.slice(0, index).concat({
            to: `/${removeUrn(topic.id)}`,
            name: topic.name,
          }),
        );
      }
    },
  });

  if (error) {
    handleError(error);
    if (isAccessDeniedError(error)) {
      navigate('/403', { replace: true });
    } else {
      navigate('/404', { replace: true });
    }
  }

  if (loading || !data?.topic?.article) {
    return <Spinner />;
  }

  return (
    <Topic
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      showResources={showResources}
      subject={subject}
      loading={loading}
    />
  );
};

TopicWrapper.fragments = {
  subject: gql`
    fragment TopicWrapper_Subject on Subject {
      ...Topic_Subject
    }
    ${topicFragments.subject}
  `,
};
export default TopicWrapper;
