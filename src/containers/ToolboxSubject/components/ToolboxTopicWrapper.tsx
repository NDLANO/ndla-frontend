/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
// @ts-ignore
import { Topic } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { useGraphQuery } from '../../../util/runQueries';
import { topicQuery } from '../../../queries';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import { toTopic } from '../../../routeHelpers';
import Resources from '../../Resources/Resources';
import { LocaleType } from '../../../interfaces';
import {
  GQLVisualElement,
  GQLTopic,
  GQLResourceType,
  GQLArticle,
  GQLMetaImage,
} from '../../../graphqlTypes';

interface Props {
  subjectId: string;
  topicId: string;
  locale: LocaleType;
  onSelectTopic: (index: number, id?: string) => void;
  topicList: Array<string>;
  index: number;
}
interface Data {
  topic: ToolBoxTopic;
  resourceTypes: GQLResourceType;
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

interface ToolBoxTopic extends Omit<GQLTopic, 'article'> {
  article: ToolBoxArticle;
}

const ToolboxTopicWrapper = ({
  subjectId,
  topicId,
  locale,
  onSelectTopic,
  topicList,
  index,
}: Props) => {
  const { loading, data } = useGraphQuery<Data>(topicQuery, {
    variables: {
      subjectId,
      topicId,
    },
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return <DefaultErrorMessage />;
  }

  const { topic, resourceTypes } = data;
  const { article } = data.topic;

  const toolboxTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction,
      image: { url: article.metaImage?.url, alt: article?.metaImage?.alt },
      visualElement: {
        type: getResourceType(article.visualElement.resource),
        element: (
          <VisualElementWrapper
            visualElement={article.visualElement}
            locale={locale}
          />
        ),
      },
      resources: topic.subtopics ? (
        <Resources
          topic={topic}
          resourceTypes={resourceTypes}
          locale={locale}
        />
      ) : (
        undefined
      ),
    },
  };

  const subTopics = topic?.subtopics?.map((subtopic: GQLTopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === topicList[index + 1],
      url: toTopic(subjectId, ...topicList, subtopic.id),
    };
  });

  return (
    <>
      <Topic
        frame={subTopics?.length === 0}
        isLoading={loading}
        subTopics={subTopics}
        onSubTopicSelected={(_e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(index + 1, id)
        }
        topic={toolboxTopic.topic}
      />
    </>
  );
};

export default ToolboxTopicWrapper;
