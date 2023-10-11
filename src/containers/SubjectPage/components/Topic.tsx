/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import { useContext, useEffect, useMemo, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Topic as UITopic } from '@ndla/ui';
import { useTracker } from '@ndla/tracker';
import { DynamicComponents, extractEmbedMeta } from '@ndla/article-converter';
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
import { transformArticle } from '../../../util/transformArticle';
import config from '../../../config';
import { getArticleScripts } from '../../../util/getArticleScripts';
import AddEmbedToFolder from '../../../components/MyNdla/AddEmbedToFolder';
import { AuthContext } from '../../../components/AuthenticationContext';

const getDocumentTitle = ({
  t,
  topic,
}: {
  t: TFunction;
  topic: Props['topic'];
}) => {
  return htmlTitle(topic?.name, [t('htmlTitles.titleTemplate')]);
};

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
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
};

const Topic = ({
  topicId,
  subjectId,
  subTopicId,
  topic,
  resourceTypes,
  showResources,
  loading,
  subject,
}: Props) => {
  const { t, i18n } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { topicId: urnTopicId } = useUrnIds();
  const { trackPageView } = useTracker();
  const [showContent, setShowContent] = useState(false);
  const ndlaFilm = useIsNdlaFilm();

  useEffect(() => {
    if (showResources && !loading && topic.article && authContextLoaded) {
      const topicPath = topic?.path
        ?.split('/')
        .slice(2)
        .map(
          (t) =>
            subject?.allTopics?.find(
              (topic) => topic.id.replace('urn:', '') === t,
            ),
        );
      const dimensions = getAllDimensions(
        {
          subject,
          topicPath,
          article: topic.article,
          filter: subject?.name,
          user,
        },
        undefined,
        true,
      );
      trackPageView({ dimensions, title: getDocumentTitle({ t, topic }) });
    }
  }, [
    authContextLoaded,
    loading,
    showResources,
    subject,
    t,
    topic,
    trackPageView,
    user,
  ]);

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

  const [article, scripts] = useMemo(() => {
    if (!topic.article) return [undefined, undefined];
    return [
      transformArticle(topic.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${topic.article?.id}`,
        subject: subjectId,
        components: converterComponents,
      }),
      getArticleScripts(topic.article, i18n.language),
    ];
  }, [i18n.language, subjectId, topic.article]);

  if (!topic.article || !article) {
    return null;
  }

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
        topic.article?.content !== ''
          ? () => setShowContent(!showContent)
          : undefined
      }
      showContent={showContent}
      title={article.title}
      introduction={article.introduction}
      resources={resources}
      subTopics={subTopics}
      metaImage={article.metaImage}
      isLoading={false}
      invertedStyle={ndlaFilm}
      isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
    >
      <ArticleContents
        article={article}
        scripts={scripts}
        modifier="in-topic"
        showIngress={false}
      />
    </UITopic>
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
        ...ArticleContents_Article
      }
      ...Resources_Topic
    }
    ${TopicVisualElementContent.fragments.metadata}
    ${ArticleContents.fragments.article}
    ${Resources.fragments.topic}
  `,
  resourceType: gql`
    fragment Topic_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default Topic;
