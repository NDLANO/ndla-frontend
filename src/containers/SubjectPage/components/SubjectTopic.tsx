/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { TFunction } from "i18next";
import { useContext, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { extractEmbedMeta } from "@ndla/article-converter";
import { useComponentSize } from "@ndla/hooks";
import { BleedPageContent, PageContent } from "@ndla/primitives";
import { useTracker } from "@ndla/tracker";
import TopicVisualElementContent from "./TopicVisualElementContent";
import { AuthContext } from "../../../components/AuthenticationContext";
import NavigationBox from "../../../components/NavigationBox";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import Topic from "../../../components/Topic/Topic";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_SubjectFragment,
  GQLTopic_TopicFragment,
} from "../../../graphqlTypes";
import { toTopic, useUrnIds } from "../../../routeHelpers";
import { getTopicPath } from "../../../util/getTopicPath";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import MultidisciplinaryArticleList from "../../MultidisciplinarySubject/components/MultidisciplinaryArticleList";
import Resources from "../../Resources/Resources";
import { scrollToRef } from "../subjectPageHelpers";

const getDocumentTitle = ({ t, topic }: { t: TFunction; topic: Props["topic"] }) => {
  return htmlTitle(topic?.name, [t("htmlTitles.titleTemplate")]);
};

const PAGE = "page" as const;

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
  const { t } = useTranslation();
  const { height: mastheadHeightPx } = useComponentSize("masthead");
  const { user, authContextLoaded } = useContext(AuthContext);
  const { topicId: urnTopicId, subjectType, topicList } = useUrnIds();
  const { trackPageView } = useTracker();
  const topicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topicList[topicList.length - 1] === topicId && topicRef.current) {
      scrollToRef(topicRef, mastheadHeightPx);
      if (document.activeElement?.nodeName !== "BODY") {
        document.getElementById(SKIP_TO_CONTENT_ID)?.focus();
      }
    }
  }, [mastheadHeightPx, topicId, topicList]);

  const topicPath = useMemo(() => {
    if (!topic?.path) return [];
    return getTopicPath(topic.contexts, topic.path);
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
    if (!embedMeta) return undefined;
    return <TopicVisualElementContent embed={embedMeta} metaImage={topic.article?.metaImage} />;
  }, [embedMeta, topic.article?.metaImage]);

  const resources = useMemo(() => {
    if (topic.coreResources?.length || topic.supplementaryResources?.length) {
      return <Resources topic={topic} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />;
    }
    return null;
  }, [resourceTypes, topic]);

  if (!topic.article) {
    return null;
  }

  const subTopics = topic?.subtopics?.map((subtopic) => {
    return {
      ...subtopic,
      label: subtopic.name,
      current:
        subtopic.id === subTopicId && subtopic.id === topicList[topicList.length - 1]
          ? PAGE
          : subtopic.id === subTopicId,
      url: toTopic(subjectId, ...topicPath.slice(1).map((t) => t.id), topic?.id, subtopic.id),
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
        title={parse(topic.article.htmlTitle ?? "")}
        introduction={parse(topic.article.htmlIntroduction ?? "")}
        isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
        ref={topicRef}
      />
      {subjectType === "multiDisciplinary" && topicList.length === 2 && urnTopicId === topicId ? (
        <MultidisciplinaryArticleList topics={topic.subtopics ?? []} />
      ) : subTopics?.length ? (
        <NavigationBox
          variant="secondary"
          heading={t("subjectPage.topicsTitle", { topic: topic.name })}
          items={subTopics}
        />
      ) : null}
      {!!resources && (
        <BleedPageContent data-resource-section="">
          <PageContent variant="article">{resources}</PageContent>
        </BleedPageContent>
      )}
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
        ...MultidisciplinaryArticleList_Topic
      }
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      supportedLanguages
      contexts {
        breadcrumbs
        parentIds
        path
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
