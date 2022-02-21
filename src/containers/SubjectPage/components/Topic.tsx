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
import { RELEVANCE_SUPPLEMENTARY } from '../../../constants';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';
import { toTopic } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import {
  getCrop,
  getFocalPoint,
  getImageWithoutCrop,
} from '../../../util/imageHelpers';
import {
  GQLResourceTypeDefinition,
  GQLTopicQueryTopicFragment,
} from '../../../graphqlTypes';
import { LocaleType } from '../../../interfaces';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';
import { FeideUserWithGroups } from '../../../util/feideApi';
import { GQLSubjectContainerType } from '../SubjectContainer';

const getDocumentTitle = ({
  t,
  topic,
}: {
  t: TFunction;
  topic: Props['topic'];
}) => {
  return htmlTitle(topic?.name, [t('htmlTitles.titleTemplate')]);
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
  subject?: GQLSubjectContainerType;
  loading?: boolean;
  topic: GQLTopicQueryTopicFragment;
  resourceTypes?: Array<GQLResourceTypeDefinition>;
  user?: FeideUserWithGroups;
} & WithTranslation;

const Topic = ({
  topicId,
  subjectId,
  locale,
  subTopicId,
  ndlaFilm,
  onClickTopics,
  topic,
  resourceTypes,
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

  if (!topic.article) {
    return null;
  }

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
                visualElement={{
                  ...article.visualElement,
                  image: getImageWithoutCrop(article.visualElement.image),
                }}
                locale={locale}
              />
            ),
          }
        : undefined,
      resources: topic.subtopics ? (
        <Resources
          topic={topic}
          resourceTypes={resourceTypes}
          locale={locale}
          ndlaFilm={ndlaFilm}
        />
      ) : (
        undefined
      ),
    },
  };

  const path = topic?.path || '';
  const topicPath = path
    ?.split('/')
    .slice(2)
    .map(id => `urn:${id}`);

  const subTopics = topic?.subtopics?.map(subtopic => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: toTopic(subjectId, ...topicPath, subtopic.id),
      isAdditionalResource: subtopic.relevanceId === RELEVANCE_SUPPLEMENTARY,
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
      isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
      onSubTopicSelected={(e: React.MouseEvent<HTMLElement>) =>
        onClickTopics(e as React.MouseEvent<HTMLAnchorElement>)
      }>
      <ArticleContents
        topic={topic}
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
  const { topic, loading, showResources } = currentProps;
  if (showResources && !loading && topic?.article) {
    trackPageView(currentProps);
  }
};

Topic.getDimensions = ({ topic, subject, user }: Props) => {
  const topicPath = topic?.path
    ?.split('/')
    .slice(2)
    .map(t =>
      subject?.allTopics?.find(topic => topic.id.replace('urn:', '') === t),
    );

  return getAllDimensions(
    {
      subject: subject,
      topicPath,
      article: topic.article,
      filter: subject?.name,
      user,
    },
    undefined,
    true,
  );
};

export default withTranslation()(withTracker(Topic));
