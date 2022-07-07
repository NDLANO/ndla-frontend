import { gql } from '@apollo/client';
import { Spinner } from '@ndla/icons';
import { FeideUserApiType } from '@ndla/ui';
import { useGraphQuery } from '../../../util/runQueries';
import MultidisciplinaryTopic, {
  multidisciplinaryTopicFragments,
} from './MultidisciplinaryTopic';
import {
  GQLMultidisciplinaryTopicWrapperQuery,
  GQLMultidisciplinaryTopicWrapperQueryVariables,
  GQLMultidisciplinaryTopic_SubjectFragment,
} from '../../../graphqlTypes';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  disableNav?: boolean;
  user?: FeideUserApiType;
}

const multidisciplinaryTopicWrapperQuery = gql`
  query multidisciplinaryTopicWrapper($topicId: String!, $subjectId: String) {
    topic(id: $topicId, subjectId: $subjectId) {
      id
      ...MultidisciplinaryTopic_Topic
    }
    resourceTypes {
      ...MultidisciplinaryTopic_ResourceTypeDefinition
    }
  }
  ${multidisciplinaryTopicFragments.resourceType}
  ${multidisciplinaryTopicFragments.topic}
`;

const MultidisciplinaryTopicWrapper = ({
  topicId,
  subjectId,
  subTopicId,
  subject,
  disableNav,
  user,
}: Props) => {
  const { data, loading } = useGraphQuery<
    GQLMultidisciplinaryTopicWrapperQuery,
    GQLMultidisciplinaryTopicWrapperQueryVariables
  >(multidisciplinaryTopicWrapperQuery, {
    variables: { topicId, subjectId },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data?.topic) {
    return <DefaultErrorMessage />;
  }

  return (
    <MultidisciplinaryTopic
      topic={data.topic}
      resourceTypes={data.resourceTypes}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      subject={subject}
      disableNav={disableNav}
      user={user}
    />
  );
};

MultidisciplinaryTopicWrapper.fragments = {
  subject: gql`
    fragment MultidisciplinaryTopicWrapper_Subject on Subject {
      ...MultidisciplinaryTopic_Subject
    }
    ${multidisciplinaryTopicFragments.subject}
  `,
};

export default MultidisciplinaryTopicWrapper;
