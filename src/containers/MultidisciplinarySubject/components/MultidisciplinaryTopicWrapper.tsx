import { gql } from '@apollo/client';
import Spinner from '@ndla/ui/lib/Spinner';
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
import { LocaleType } from '../../../interfaces';
import { FeideUserWithGroups } from '../../../util/feideApi';

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  ndlaFilm?: boolean;
  disableNav?: boolean;
  user?: FeideUserWithGroups;
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
  locale,
  subTopicId,
  ndlaFilm,
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
      locale={locale}
      ndlaFilm={ndlaFilm}
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
