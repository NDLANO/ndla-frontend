/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DynamicComponents, extractEmbedMeta } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import TopicVisualElementContent from "./TopicVisualElementContent";
import ArticleContents from "../../../components/Article/ArticleContents";
import { AuthContext } from "../../../components/AuthenticationContext";
import AddEmbedToFolder from "../../../components/MyNdla/AddEmbedToFolder";
import NavigationBox from "../../../components/NavigationBox";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import Topic from "../../../components/Topic/Topic";
import TopicArticle from "../../../components/Topic/TopicArticle";
import config from "../../../config";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_SubjectFragment,
  GQLTopic_TopicFragment,
} from "../../../graphqlTypes";
import { toTopic, useUrnIds } from "../../../routeHelpers";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { getTopicPath } from "../../../util/getTopicPath";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import { transformArticle } from "../../../util/transformArticle";
import Resources from "../../Resources/Resources";

const getDocumentTitle = ({ t, topic }: { t: TFunction; topic: Props["topic"] }) => {
  return htmlTitle(topic?.name, [t("htmlTitles.titleTemplate")]);
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

const SubjectTopic = ({
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

  const topicPath = useMemo(() => {
    if (!topic?.path) return [];
    return getTopicPath(topic.path, topic.contexts);
  }, [topic]);

  useEffect(() => {
    if (showResources && !loading && topic.article && authContextLoaded) {
      const dimensions = getAllDimensions({
        article: topic.article,
        filter: subject?.name,
        user,
      });
      trackPageView({ dimensions, title: getDocumentTitle({ t, topic }) });
    }
  }, [authContextLoaded, loading, showResources, subject, t, topic, trackPageView, user]);

  const embedMeta = useMemo(() => {
    if (!topic.article?.transformedContent?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(topic.article.transformedContent?.visualElementEmbed.content);
    return embedMeta;
  }, [topic?.article?.transformedContent?.visualElementEmbed?.content]);

  const visualElement = useMemo(() => {
    if (!embedMeta || !topic.article?.transformedContent?.visualElementEmbed?.meta) return undefined;
    return (
      <TopicVisualElementContent
        embed={embedMeta}
        metadata={topic.article?.transformedContent?.visualElementEmbed?.meta}
      />
    );
  }, [embedMeta, topic.article?.transformedContent?.visualElementEmbed?.meta]);

  const resources = useMemo(() => {
    if (topic.subtopics) {
      return <Resources topic={topic} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />;
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

  const subTopics = topic?.subtopics?.map((subtopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: toTopic(topicPath[0]!.id, ...topicPath.slice(1).map((t) => t.id), topic?.id, subtopic.id),
      isAdditionalResource: subtopic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  const pageTitle = htmlTitle([topic.name, subject?.name].filter((e) => !!e).join(" - "), [
    t("htmlTitles.titleTemplate"),
  ]);

  return (
    <>
      {urnTopicId === topicId && (
        <>
          <Helmet>
            <title>{pageTitle}</title>
          </Helmet>
          <SocialMediaMetadata
            title={pageTitle}
            description={topic.meta?.metaDescription}
            imageUrl={topic.meta?.metaImage?.url}
            trackableContent={{ supportedLanguages: topic.supportedLanguages }}
          />
        </>
      )}
      <Topic
        visualElement={visualElement}
        visualElementEmbedMeta={embedMeta}
        id={urnTopicId === topicId ? SKIP_TO_CONTENT_ID : undefined}
        title={parse(article.htmlTitle ?? "")}
        introduction={parse(article.htmlIntroduction ?? "")}
        metaImage={article.metaImage}
        isLoading={false}
        isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
      >
        {topic.article?.transformedContent?.content !== "" && (
          <TopicArticle>
            <ArticleContents
              article={article}
              scripts={scripts}
              modifier="in-topic"
              showIngress={false}
              oembed={article.oembed}
            />
          </TopicArticle>
        )}
        {!!subTopics?.length && <NavigationBox colorMode="light" heading={t("navigation.topics")} items={subTopics} />}
        {resources}
      </Topic>
    </>
  );
};

export const topicFragments = {
  subject: gql`
    fragment Topic_Subject on Subject {
      id
      name
    }
  `,
  topic: gql`
    fragment Topic_Topic on Topic {
      id
      path
      name
      relevanceId
      subtopics {
        id
        name
        relevanceId
      }
      meta {
        metaDescription
        metaImage {
          url
        }
      }
      supportedLanguages
      contexts {
        breadcrumbs
        parentIds
        path
        crumbs {
          id
          name
          path
        }
      }
      article {
        oembed
        metaImage {
          url
          alt
        }
        transformedContent(transformArgs: $transformArgs) {
          visualElementEmbed {
            content
            meta {
              ...TopicVisualElementContent_Meta
            }
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

export default SubjectTopic;
