import { gql } from '@apollo/client';
import { useContext, useEffect, MouseEvent } from 'react';
import { useHistory, useLocation } from 'react-router';
import Spinner from '@ndla/ui/lib/Spinner';
import { AuthContext } from '../../../components/AuthenticationContext';
import Topic, { topicFragments } from './Topic';
import { useGraphQuery } from '../../../util/runQueries';
import handleError, { isAccessDeniedError } from '../../../util/handleError';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import {
  GQLTopicWrapperQuery,
  GQLTopicWrapperQueryVariables,
  GQLTopicWrapper_SubjectFragment,
} from '../../../graphqlTypes';

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: MouseEvent<HTMLAnchorElement>) => void;
  setBreadCrumb: (item: BreadcrumbItem) => void;
  index: number;
  showResources: boolean;
  subject: GQLTopicWrapper_SubjectFragment;
};

const topicWrapperQuery = gql`
  query topicWrapper($topicId: String!, $subjectId: String) {
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
  locale,
  ndlaFilm,
  onClickTopics,
  setBreadCrumb,
  showResources,
  subject,
  index,
}: Props) => {
  const location = useLocation();
  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { data, loading, error } = useGraphQuery<
    GQLTopicWrapperQuery,
    GQLTopicWrapperQueryVariables
  >(topicWrapperQuery, {
    variables: { topicId, subjectId },
    onCompleted: data => {
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
      history.replace('/403');
    } else {
      history.replace('/404');
    }
  }

  useEffect(() => {
    // Set localStorage 'lastPath' so feide authentication redirects us back here if logged in.
    if (isAccessDeniedError(error)) {
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [error, location]);

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
      locale={locale}
      ndlaFilm={ndlaFilm}
      onClickTopics={onClickTopics}
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
