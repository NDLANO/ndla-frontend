/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
// @ts-ignore
import { Topic, Image } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { useGraphQuery } from '../../../util/runQueries';
import { topicQuery } from '../../../queries';
import { DefaultErrorMessage } from '../../../components/DefaultErrorMessage';
// @ts-ignore
import { toTopic } from '../../../routeHelpers';
import Resources from '../../Resources/Resources';
import { LocaleType, ResourceType } from '../../../interfaces';
import {
  GQLVisualElement,
  GQLTopic,
  GQLResourceType,
} from '../../../graphqlTypes';

interface Props {
  subjectId: string;
  topicId: string;
  locale: LocaleType;
  onSelectTopic: (index: number, id: string | undefined) => void;
  topicList: Array<string>;
  index: number;
}

interface VisualElement {
  visualElement: GQLVisualElement;
}

const VisualElementWrapper = ({ visualElement }: VisualElement) => {
  const { resource, url, alt, image } = visualElement;
  switch (resource) {
    case 'image':
      return <Image alt={alt} src={image?.src} />;
    default:
    case 'video':
    case 'other':
      return (
        <iframe
          title="About subject video"
          src={url}
          allowFullScreen
          scrolling="no"
          frameBorder="0"
        />
      );
  }
};

interface Data {
  topic: GQLTopic;
  resourceTypes: GQLResourceType;
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
      title: article?.title!,
      introduction: article?.introduction!,
      image: { url: article?.metaImage?.url!, alt: article?.metaImage?.alt! },
      visualElement: {
        type: article?.visualElement?.resource as ResourceType,
        element: (
          <VisualElementWrapper visualElement={article?.visualElement} />
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

  const subTopics = topic?.subtopics?.map((subtopic: any) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === topicList[index + 1],
      url: toTopic(subjectId, topicId, subtopic.id),
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
