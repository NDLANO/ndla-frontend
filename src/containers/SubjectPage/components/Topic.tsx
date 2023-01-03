/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useEffect, useMemo, useState } from 'react';
import { Remarkable } from 'remarkable';
import {
  CustomWithTranslation,
  TFunction,
  withTranslation,
} from 'react-i18next';
import { TopicProps, FeideUserApiType, Topic as UITopic } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import config from '../../../config';
import {
  RELEVANCE_SUPPLEMENTARY,
  SKIP_TO_CONTENT_ID,
} from '../../../constants';
import ArticleContents from '../../../components/Article/ArticleContents';
import Resources from '../../Resources/Resources';
import { toTopic, useIsNdlaFilm, useUrnIds } from '../../../routeHelpers';
import { getAllDimensions } from '../../../util/trackingUtil';
import { htmlTitle } from '../../../util/titleHelper';
import {
  getCrop,
  getFocalPoint,
  getImageWithoutCrop,
} from '../../../util/imageHelpers';
import {
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_SubjectFragment,
  GQLTopic_TopicFragment,
} from '../../../graphqlTypes';
import VisualElementWrapper, {
  getResourceType,
} from '../../../components/VisualElement/VisualElementWrapper';

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
  index?: number;
  showResources?: boolean;
  subject?: GQLTopic_SubjectFragment;
  loading?: boolean;
  topic: GQLTopic_TopicFragment;
  resourceTypes?: GQLTopic_ResourceTypeDefinitionFragment[];
  user?: FeideUserApiType;
} & CustomWithTranslation;

const Topic = ({
  topicId,
  subjectId,
  subTopicId,
  topic,
  resourceTypes,
}: Props) => {
  const { topicId: urnTopicId } = useUrnIds();
  const [showContent, setShowContent] = useState(false);
  const markdown = useMemo(() => {
    const md = new Remarkable({ breaks: true });
    md.inline.ruler.enable(['sub', 'sup']);
    md.block.ruler.disable(['list']);
    return md;
  }, []);
  const ndlaFilm = useIsNdlaFilm();
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
              />
            ),
          }
        : undefined,
      resources: topic.subtopics ? (
        <Resources
          topic={topic}
          resourceTypes={resourceTypes}
          headingType="h3"
          subHeadingType="h4"
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
      id={urnTopicId === topicId ? SKIP_TO_CONTENT_ID : undefined}
      onToggleShowContent={
        article.content !== '' ? () => setShowContent(!showContent) : undefined
      }
      showContent={showContent}
      topic={transposedTopic.topic}
      subTopics={subTopics}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}
      isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}>
      <ArticleContents
        topic={topic}
        copyPageUrlLink={copyPageUrlLink}
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

export const topicFragments = {
  subject: gql`
    fragment Topic_Subject on Subject {
      id
      name
      allTopics {
        id
        name
      }
    }
  `,
  topic: gql`
    fragment Topic_Topic on Topic {
      path
      name
      relevanceId
      subtopics {
        id
        name
        relevanceId
      }
      article {
        metaImage {
          url
          alt
        }
        visualElement {
          ...VisualElementWrapper_VisualElement
        }
        revisionDate
      }
      ...ArticleContents_Topic
      ...Resources_Topic
    }
    ${VisualElementWrapper.fragments.visualElement}
    ${ArticleContents.fragments.topic}
    ${Resources.fragments.topic}
  `,
  resourceType: gql`
    fragment Topic_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default withTranslation()(withTracker(Topic));
