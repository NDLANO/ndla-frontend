import { gql } from '@apollo/client';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '@ndla/icons';
import { AuthContext } from '../../../components/AuthenticationContext';
import Topic, { topicFragments } from './Topic';
import { useGraphQuery } from '../../../util/runQueries';
import handleError, { isAccessDeniedError } from '../../../util/handleError';
import { BreadcrumbItem } from '../../../interfaces';
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_SubjectFragment,
} from '../../../graphqlTypes';

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  setBreadCrumb: (item: BreadcrumbItem) => void;
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
  const { user } = useContext(AuthContext);
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
      if (data.topic) {
        setBreadCrumb({
          id: data.topic.id,
          label: data.topic.name,
          index: index,
          url: '',
        });
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
      user={user}
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
