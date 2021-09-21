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
//@ts-ignore
import { Spinner } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import DefaultErrorMessage from '../../../components/DefaultErrorMessage';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import { toTopic } from '../../../routeHelpers';
import { getCrop, getFocalPoint } from '../../../util/imageHelpers';
import Resources from '../../Resources/Resources';
import { LocaleType } from '../../../interfaces';
import { GQLTopic } from '../../../graphqlTypes';
import { TopicData } from '../ToolboxSubjectPage';

interface Props {
  subjectId: string;
  topicData?: TopicData;
  loading: boolean;
  locale: LocaleType;
  onSelectTopic: (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => void;
  topicList: Array<string>;
  index: number;
}

const ToolboxTopicWrapper = ({
  subjectId,
  topicData,
  loading,
  locale,
  onSelectTopic,
  topicList,
  index,
}: Props) => {
  if (loading) {
    return <Spinner />;
  }

  if (!topicData) {
    return <DefaultErrorMessage />;
  }

  const { topic, resourceTypes } = topicData;
  const { article } = topic;
  const image =
    article.visualElement?.resource === 'image'
      ? {
          url: article.visualElement.image?.src!,
          alt: article.visualElement.image?.alt!,
          crop: getCrop(article.visualElement.image!),
          focalPoint: getFocalPoint(article.visualElement.image!),
        }
      : {
          url: article.metaImage?.url!,
          alt: article?.metaImage?.alt!,
        };
  const toolboxTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction,
      image,
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
    const path = topic.path || '';
    const topicPath = path
      .split('/')
      .slice(2)
      .map(id => `urn:${id}`);
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === topicList[index + 1],
      url: toTopic(subjectId, ...topicPath, subtopic.id),
    };
  });

  return (
    <>
      <Topic
        frame={subTopics?.length === 0}
        isLoading={loading}
        subTopics={subTopics}
        onSubTopicSelected={(e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(e as React.MouseEvent<HTMLAnchorElement>, index + 1, id)
        }
        topic={toolboxTopic.topic}
      />
    </>
  );
};

export default ToolboxTopicWrapper;
