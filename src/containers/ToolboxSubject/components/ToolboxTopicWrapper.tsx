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
import { useGraphQuery } from '../../../util/runQueries';
import { topicQuery } from '../../../queries';
import { DefaultErrorMessage } from '../../../components/DefaultErrorMessage';
// @ts-ignore
import { toTopic } from '../../../routeHelpers';
import Resources from '../../Resources/Resources';
import { LocaleType } from '../../../interfaces';

interface Props {
  subjectId: string;
  topicId: string;
  locale: LocaleType;
  onSelectTopic: (index: number, id: string | undefined) => void;
  topicList: Array<string>;
  index: number;
}

const ToolboxTopicWrapper = ({
  subjectId,
  topicId,
  locale,
  onSelectTopic,
  topicList,
  index,
}: Props) => {
  const { loading, data } = useGraphQuery(topicQuery, {
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
  
  const transposedTopic = {
    
    ...topic,
    visualElement: {
      type: article.visualElement?.visualElement?.match(
        '(?<=data-resource=")[^"]*',
      )[0],
      element: (<div dangerouslySetInnerHTML={article.visualElement?.visualElement}/>),
    },
    image: { url: article.metaImage.url, alt: article.metaImage.alt },
    introduction: article.introduction,
    title: article.title,
    resources: data.topic.subTopics ? (
      undefined
    ) : (
      <Resources topic={topic} resourceTypes={resourceTypes} locale={locale} />
    ),
    subtopics: topic.subtopics.map((subtopic: any) => {
      return {
        ...subtopic,
        label: subtopic.name,
        selected: subtopic.id === topicList[index + 1],
        url: toTopic(subjectId, topicId, subtopic.id),
      };
    }),
  };

  console.log(transposedTopic.visualElement.element);

  return (
    <>
      <Topic
        frame={transposedTopic.subtopics.length === 0}
        isLoading={transposedTopic.loading}
        subTopics={transposedTopic.subtopics}
        onSubTopicSelected={(_e: React.MouseEvent<HTMLElement>, id?: string) =>
          onSelectTopic(index + 1, id)
        }
        topic={transposedTopic}
      />
    </>
  );
};

export default ToolboxTopicWrapper;
