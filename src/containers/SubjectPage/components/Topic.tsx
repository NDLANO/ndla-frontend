/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import { TFunction, withTranslation, WithTranslation } from 'react-i18next';
import { Topic as UITopic } from '@ndla/ui';
import { TopicProps } from '@ndla/ui/lib/Topic/Topic';
import { withTracker } from '@ndla/tracker';
import config from '../../../config';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import { getCrop, getFocalPoint } from '../../../util/imageHelpers';
import { getSubjectLongName } from '../../../data/subjects';
import { GQLResourceType, GQLSubject, GQLTopic } from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';

const getDocumentTitle = ({
  t,
  data,
}: {
  t: TFunction;
  data: Props['data'];
}) => {
  return htmlTitle(data?.topic?.name, [t('htmlTitles.titleTemplate')]);
};

type Props = {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  locale: LocaleType;
  ndlaFilm?: boolean;
  onClickTopics: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  index?: number;
  showResources?: boolean;
  subject?: GQLSubject & { allTopics: GQLTopic[] };
  loading?: boolean;
  data: {
    topic: GQLTopic;
    resourceTypes: Array<GQLResourceType>;
  };
} & WithTranslation;

const Topic = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  data,
}: Props) => {
  const [showContent, setShowContent] = useState(false);
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const renderMarkdown = (text: string) => markdown.render(text);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  if (!data.topic.article) {
    return null;
  }

  const { article } = data.topic;
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
  const transposedTopic: TopicProps = {
    topic: {
      title: article.title,
      introduction: article.introduction!,
      image,
      visualElement: article.visualElement
        ? {
            type: getResourceType(article.visualElement.resource),
            element: (
              <VisualElementWrapper
                visualElement={article.visualElement}
                locale={locale}
              />
            ),
          }
        : undefined,
      resources: data.topic.subtopics ? (
        <Resources
          topic={data.topic}
          resourceTypes={data.resourceTypes}
          locale={locale}
          ndlaFilm={ndlaFilm}
        />
      ) : (
        undefined
      ),
    },
  };

  const topic = data.topic;

  const path = data.topic?.path || '';
  const topicPath = path
    ?.split('/')
    .slice(2)
    .map(id => `urn:${id}`);

  const subTopics = data.topic?.subtopics?.map((subtopic: GQLTopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: toTopic(subjectId, ...topicPath, subtopic.id),
    };
  });
  const copyPageUrlLink = config.ndlaFrontendDomain + topic.path;

  return (
    <UITopic
      onToggleShowContent={
        article.content !== '' ? () => setShowContent(!showContent) : undefined
      }
      showContent={showContent}
      topic={transposedTopic.topic}
      subTopics={subTopics}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}
      onSubTopicSelected={(e: React.MouseEvent<HTMLElement>) =>
        onClickTopics(e as React.MouseEvent<HTMLAnchorElement>)
      }>
      <ArticleContents
        topic={data.topic}
        copyPageUrlLink={copyPageUrlLink}
        locale={locale}
        modifier="in-topic"
        showIngress={false}
      />
    </UITopic>
  );
};

Topic.getDocumentTitle = getDocumentTitle;

Topic.willTrackPageView = (
  trackPageView: (item: Props) => void,
  currentProps: Props,
) => {
  const { data, loading, showResources } = currentProps;
  if (showResources && !loading && data?.topic?.article) {
    trackPageView(currentProps);
  }
};

Topic.getDimensions = ({ data, locale, subject }: Props) => {
  const topicPath = data?.topic?.path
    ?.split('/')
    .slice(2)
    .map(t =>
      subject?.allTopics.find(topic => topic.id.replace('urn:', '') === t),
    );

  const longName = getSubjectLongName(subject?.id, locale);

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      article: data.topic.article,
      filter: longName,
    },
    undefined,
    true,
  );
};

export default withTranslation()(withTracker(Topic));
