import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Spinner from '@ndla/ui/lib/Spinner';
import Topic from './Topic';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import {
  GQLSubject,
  GQLTopicQuery,
  GQLTopicQueryVariables,
} from '../../../graphqlTypes';

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
  subject: GQLSubject;
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
  const { data, loading } = useGraphQuery<
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
    />
  );
};
export default withTranslation()(TopicWrapper);
