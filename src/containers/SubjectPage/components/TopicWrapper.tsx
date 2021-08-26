import React from 'react';
import Spinner from '@ndla/ui/lib/Spinner';
import { withTranslation, WithTranslation } from 'react-i18next';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import Topic from './Topic';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import { GQLSubject, GQLTopic } from '../../../graphqlTypes';

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  setBreadCrumb: (item: BreadcrumbItem) => void;
  index: number;
  showResources: boolean;
  subject: GQLSubject & { allTopics: GQLTopic[] };
}

const TopicWrapper = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  setBreadCrumb,
  index,
  showResources,
  subject,
  t,
}: Props & WithTranslation) => {
  const { data, loading } = useGraphQuery(topicQuery, {
    variables: { topicId, subjectId },
    onCompleted: data => {
      setBreadCrumb({
        id: data.topic.id,
        label: data.topic.name,
        index: index,
        url: '',
      });
    },
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <Topic
      data={data}
      topicId={topicId}
      subjectId={subjectId}
      subTopicId={subTopicId}
      locale={locale}
      ndlaFilm={ndlaFilm}
      onClickTopics={onClickTopics}
      showResources={showResources}
      subject={subject}
      loading={loading}
      t={t}
    />
  );
};

export default withTranslation()(TopicWrapper);
