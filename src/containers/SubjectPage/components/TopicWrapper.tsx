import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router';
import { withTranslation, WithTranslation } from 'react-i18next';
import Spinner from '@ndla/ui/lib/Spinner';
import { AuthContext } from '../../../components/AuthenticationContext';
import Topic from './Topic';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import handleError, { isAccessDeniedError } from '../../../util/handleError';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import { GQLTopicQuery, GQLTopicQueryVariables } from '../../../graphqlTypes';
import { GQLSubjectContainerType } from '../SubjectContainer';

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  setBreadCrumb: (item: BreadcrumbItem) => void;
  index: number;
  showResources: boolean;
  subject: GQLSubjectContainerType;
} & WithTranslation;

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
    GQLTopicQuery,
    GQLTopicQueryVariables
  >(topicQuery, {
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
export default withTranslation()(TopicWrapper);
