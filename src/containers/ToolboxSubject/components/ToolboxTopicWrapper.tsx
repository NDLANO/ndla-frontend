/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
// @ts-ignore
import { Topic } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import { toTopic } from '../../../routeHelpers';
import { getCrop, getFocalPoint } from '../../../util/imageHelpers';
import Resources from '../../Resources/Resources';
import { LocaleType } from '../../../interfaces';
import {
  GQLSubject,
  GQLTopic,
  GQLResourceTypeDefinition,
} from '../../../graphqlTypes';
import { getSubjectLongName } from '../../../data/subjects';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';

interface Props extends WithTranslation {
  subject: GQLSubject;
  topic: GQLTopic;
  resourceTypes?: GQLResourceTypeDefinition[];
  locale: LocaleType;
  onSelectTopic: (
    e: React.MouseEvent<HTMLAnchorElement>,
    index: number,
    id?: string,
  ) => void;
  topicList: Array<string>;
  index: number;
  loading?: boolean;
}

const getDocumentTitle = ({ t, topic }: Props) => {
  return htmlTitle(topic.name, [t('htmlTitles.titleTemplate')]);
};

const ToolboxTopicWrapper = ({
  subject,
  locale,
  onSelectTopic,
  topicList,
  index,
  topic,
  resourceTypes,
  loading,
}: Props) => {
  if (!topic.article) {
    return null;
  }

  const { article } = topic;

  const image =
    article?.visualElement?.resource === 'image'
      ? {
          url: article.visualElement.image?.src!,
          alt: article.visualElement.image?.alt!,
          crop: getCrop(article.visualElement.image!),
          focalPoint: getFocalPoint(article.visualElement.image!),
        }
      : {
          url: article?.metaImage?.url!,
          alt: article?.metaImage?.alt!,
        };
  const toolboxTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction || '',
      image,
      ...(article.visualElement && {
        visualElement: {
          type: getResourceType(article.visualElement.resource),
          element: (
            <VisualElementWrapper
              visualElement={article.visualElement}
              locale={locale}
            />
          ),
        },
      }),
      resources: topic?.subtopics ? (
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
      url: toTopic(subject.id, ...topicPath, subtopic.id),
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

ToolboxTopicWrapper.getDocumentTitle = getDocumentTitle;

ToolboxTopicWrapper.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  if (
    currentProps.topic &&
    currentProps.index === currentProps.topicList.length - 1
  ) {
    trackPageView(currentProps);
  }
};

ToolboxTopicWrapper.getDimensions = (props: Props) => {
  const { subject, locale, topicList, topic } = props;
  const topicPath = topicList.map(t =>
    subject.allTopics?.find(topic => topic.id === t),
  );

  const longName = getSubjectLongName(subject?.id, locale);

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      filter: longName,
      article: topic.article,
    },
    undefined,
    topicList.length > 0,
  );
};

export default withTranslation()(withTracker(ToolboxTopicWrapper));
