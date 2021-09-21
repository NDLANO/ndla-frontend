import React from 'react';
//@ts-ignore
import { Spinner } from '@ndla/ui';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import {
  GQLArticle,
  GQLMetaImage,
  GQLResourceType,
  GQLSubject,
  GQLTopic,
  GQLVisualElement,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import { topicQuery } from '../../../queries';
import { useGraphQuery } from '../../../util/runQueries';
import ToolboxTopicWrapper from './ToolboxTopicWrapper';

interface Props {
  subject: GQLSubject & { allTopics: GQLTopic[] };
  topicId: string;
  locale: LocaleType;
  onSelectTopic: (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => void;
  topicList: Array<string>;
  index: number;
}

interface ToolBoxArticleMetaImage extends Omit<GQLMetaImage, 'url' | 'alt'> {
  url: string;
  alt: string;
}
interface ToolBoxArticle
  extends Omit<GQLArticle, 'introduction' | 'metaImage' | 'visualElement'> {
  introduction: string;
  metaImage: ToolBoxArticleMetaImage;
  visualElement: GQLVisualElement;
}

export interface ToolBoxTopic extends Omit<GQLTopic, 'article'> {
  article: ToolBoxArticle;
}

export interface TopicData {
  topic: ToolBoxTopic;
  resourceTypes: GQLResourceType;
}

export const ToolboxTopicContainer = ({
  subject,
  topicId,
  locale,
  onSelectTopic,
  topicList,
  index,
}: Props) => {
  const { loading, data } = useGraphQuery<TopicData>(topicQuery, {
    variables: {
      subjectId: subject.id,
      topicId,
    },
  });

  if (loading) {
    return <Spinner />;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }
  return (
    <ToolboxTopicWrapper
      subject={subject}
      loading={loading}
      data={data}
      locale={locale}
      onSelectTopic={onSelectTopic}
      topicList={topicList}
      index={index}
    />
  );
};
