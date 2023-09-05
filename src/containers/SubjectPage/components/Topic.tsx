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
import { FeideUserApiType, Topic as UITopic } from '@ndla/ui';
import { withTracker } from '@ndla/tracker';
import { extractEmbedMeta } from '@ndla/article-converter';
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
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_SubjectFragment,
  GQLTopic_TopicFragment,
} from '../../../graphqlTypes';
import TopicVisualElementContent from './TopicVisualElementContent';

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

  const embedMeta = useMemo(() => {
    if (!topic.article?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(
      topic.article.visualElementEmbed.content,
    );
    return embedMeta;
  }, [topic?.article?.visualElementEmbed?.content]);

  const visualElement = useMemo(() => {
    if (!embedMeta || !topic.article?.visualElementEmbed?.meta)
      return undefined;
    return (
      <TopicVisualElementContent
        embed={embedMeta}
        metadata={topic.article?.visualElementEmbed?.meta}
      />
    );
  }, [embedMeta, topic.article?.visualElementEmbed?.meta]);

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  const resources = useMemo(() => {
    if (topic.subtopics) {
      return (
        <Resources
          topic={topic}
          resourceTypes={resourceTypes}
          headingType="h3"
          subHeadingType="h4"
        />
      );
    }
    return null;
  }, [resourceTypes, topic]);

  if (!topic.article) {
    return null;
  }

  const { article } = topic;

  const path = topic?.path || '';
  const topicPath = path
    ?.split('/')
    .slice(2)
    .map((id) => `urn:${id}`);

  const subTopics = topic?.subtopics?.map((subtopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: toTopic(subjectId, ...topicPath, subtopic.id),
      isAdditionalResource: subtopic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  return (
    <UITopic
      visualElement={visualElement}
      visualElementEmbedMeta={embedMeta}
      id={urnTopicId === topicId ? SKIP_TO_CONTENT_ID : undefined}
      onToggleShowContent={
        article.content.content !== ''
          ? () => setShowContent(!showContent)
          : undefined
      }
      showContent={showContent}
      title={article.title.title}
      introduction={article.introduction ?? ''}
      resources={resources}
      subTopics={subTopics}
      metaImage={article.metaImage}
      isLoading={false}
      renderMarkdown={renderMarkdown}
      invertedStyle={ndlaFilm}
      isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
    >
      <ArticleContents
        topic={topic}
        modifier="in-topic"
        showIngress={false}
        subjectId={subjectId}
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
    .map(
      (t) =>
        subject?.allTopics?.find((topic) => topic.id.replace('urn:', '') === t),
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
      article(convertEmbeds: $convertEmbeds) {
        metaImage {
          url
          alt
        }
        visualElementEmbed {
          content
          meta {
            ...TopicVisualElementContent_Meta
          }
        }
        revisionDate
      }
      ...ArticleContents_Topic
      ...Resources_Topic
    }
    ${TopicVisualElementContent.fragments.metadata}
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
