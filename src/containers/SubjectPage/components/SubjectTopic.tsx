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
import { extractEmbedMeta } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import TopicVisualElementContent from "./TopicVisualElementContent";
import { AuthContext } from "../../../components/AuthenticationContext";
import NavigationBox from "../../../components/NavigationBox";
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import Topic from "../../../components/Topic/Topic";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_SubjectFragment,
  GQLTopic_TopicFragment,
} from "../../../graphqlTypes";
import { getSubjectType } from "../../../routeHelpers";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import MultidisciplinaryArticleList from "../../MultidisciplinarySubject/components/MultidisciplinaryArticleList";
import Resources from "../../Resources/Resources";

const getDocumentTitle = ({ t, topic }: { t: TFunction; topic: Props["topic"] }) => {
  return htmlTitle(topic?.name, [t("htmlTitles.titleTemplate")]);
};

type Props = {
  topicId: string;
  subTopicId?: string;
  index?: number;
  showResources?: boolean;
  subject?: GQLTopic_SubjectFragment;
  loading?: boolean;
  topic: GQLTopic_TopicFragment;
  resourceTypes?: GQLTopic_ResourceTypeDefinitionFragment[];
};

const SubjectTopic = ({ topicId, subTopicId, topic, resourceTypes, showResources, loading, subject }: Props) => {
  const enablePrettyUrls = useEnablePrettyUrls();
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const subjectType = subject?.id ? getSubjectType(subject?.id) : undefined;

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
    if (!embedMeta) return undefined;
    return <TopicVisualElementContent embed={embedMeta} />;
  }, [embedMeta]);

  const resources = useMemo(() => {
    if (topic.subtopics) {
      return (
        <Resources
          topicId={topic.id}
          subjectId={subject?.id}
          topic={topic}
          resourceTypes={resourceTypes}
          headingType="h2"
          subHeadingType="h3"
        />
      );
    }
    return null;
  }, [resourceTypes, topic, subject]);

  if (!topic.article) {
    return null;
  }

  const subTopics = topic?.subtopics?.map((subtopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === subTopicId,
      url: enablePrettyUrls ? subtopic.url : subtopic.path,
      isAdditionalResource: subtopic.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  const pageTitle = htmlTitle([topic.name, subject?.name].filter((e) => !!e).join(" - "), [
    t("htmlTitles.titleTemplate"),
  ]);

  return (
    <>
      {topic.id === topicId && (
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
        id={topic.id === topicId ? SKIP_TO_CONTENT_ID : undefined}
        title={parse(topic.article.htmlTitle ?? "")}
        introduction={parse(topic.article.htmlIntroduction ?? "")}
        isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
      >
        {subjectType === "multiDisciplinary" && topic.context?.parentIds.length === 2 && topic.id === topicId ? (
          <MultidisciplinaryArticleList topics={topic.subtopics ?? []} />
        ) : subTopics?.length ? (
          <NavigationBox variant="secondary" heading={t("navigation.topics")} items={subTopics} />
        ) : null}
        {resources}
      </Topic>
    </>
  );
};

export const topicFragments = {
  subject: gql`
    fragment Topic_Subject on Node {
      id
      name
    }
  `,
  topic: gql`
    fragment Topic_Topic on Node {
      id
      path
      url
      name
      relevanceId
      subtopics: children(nodeType: TOPIC) {
        id
        name
        relevanceId
        path
        url
        ...MultidisciplinaryArticleList_Topic
      }
      meta {
        metaDescription
        metaImage {
          url
        }
      }
      supportedLanguages
      contextId
      context {
        contextId
        breadcrumbs
        parentIds
        path
        crumbs {
          contextId
          id
          name
          path
          url
        }
      }
      article {
        id
        htmlTitle
        htmlIntroduction
        grepCodes
        oembed
        metaImage {
          url
          alt
        }
        transformedContent(transformArgs: $transformArgs) {
          visualElementEmbed {
            content
          }
        }
        revisionDate
      }
      ...Resources_Topic
    }
    ${MultidisciplinaryArticleList.fragments.topic}
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
