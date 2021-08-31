import React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import Spinner from '@ndla/ui/lib/Spinner';
import Topic from './Topic';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import { BreadcrumbItem, LocaleType } from '../../../interfaces';
import { GQLResourceType, GQLSubject, GQLTopic } from '../../../graphqlTypes';

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
  subject: GQLSubject & { allTopics: GQLTopic[] };
} & WithTranslation;

interface Data {
  topic: GQLTopic;
  resourceTypes: Array<GQLResourceType>;
}

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
  const { data, loading } = useGraphQuery<Data>(topicQuery, {
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

  if (loading || !data?.topic.article) {
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
    />
  );
};
export default withTranslation()(TopicWrapper);
