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
import { useEnablePrettyUrls } from "../../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import Topic from "../../../components/Topic/Topic";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLTopic_ResourceTypeDefinitionFragment,
  GQLTopic_RootFragment,
  GQLTopic_ParentFragment,
} from "../../../graphqlTypes";
import { copyrightInfoFragment } from "../../../queries";
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
  topicIds: string[];
  activeTopic: boolean;
  subjectType?: string;
  childId?: string;
  showResources?: boolean;
  subject?: GQLTopic_RootFragment;
  loading?: boolean;
  topic: GQLTopic_ParentFragment;
  resourceTypes?: GQLTopic_ResourceTypeDefinitionFragment[];
};

const SubjectTopic = ({
  topicIds,
  activeTopic,
  subjectType,
  childId,
  topic,
  resourceTypes,
  showResources,
  loading,
  subject,
}: Props) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { height: mastheadHeightPx } = useComponentSize("masthead");
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const topicRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTopic && topicRef.current) {
      scrollToRef(topicRef, mastheadHeightPx);
      if (document.activeElement?.nodeName !== "BODY") {
        document.getElementById(SKIP_TO_CONTENT_ID)?.focus();
      }
    }
  }, [mastheadHeightPx, activeTopic]);

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
    if (topic.children?.length) {
      return <Resources topic={topic} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />;
    }
    return null;
  }, [resourceTypes, topic]);

  if (!topic.article) {
    return null;
  }

  const children = topic?.subtopics?.map((child) => {
    return {
      ...child,
      label: child.name,
      current: child.id === childId && child.id === topicIds[topicIds.length - 1] ? PAGE : child.id === childId,
      url: enablePrettyUrls ? child.url : child.path,
      isAdditionalResource: child.relevanceId === RELEVANCE_SUPPLEMENTARY,
    };
  });

  const pageTitle = htmlTitle([topic.name, subject?.name].filter((e) => !!e).join(" - "), [
    t("htmlTitles.titleTemplate"),
  ]);

  return (
    <>
      {activeTopic && (
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
        id={activeTopic ? SKIP_TO_CONTENT_ID : undefined}
        title={parse(topic.article.htmlTitle ?? "")}
        introduction={parse(topic.article.htmlIntroduction ?? "")}
        isAdditionalTopic={topic.relevanceId === RELEVANCE_SUPPLEMENTARY}
        ref={topicRef}
      />
      {subjectType === "multiDisciplinary" && topicIds.length === 2 && activeTopic ? (
        <MultidisciplinaryArticleList topics={topic.subtopics ?? []} />
      ) : children?.length ? (
        <NavigationBox
          variant="secondary"
          heading={parse(t("subjectPage.topicsTitle", { topic: topic.name }))}
          items={children}
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
  root: gql`
    fragment Topic_Root on Node {
      id
      name
    }
  `,
  parent: gql`
    fragment Topic_Parent on Node {
      id
      name
      path
      url
      relevanceId
      subtopics: children(nodeType: "TOPIC") {
        id
        name
        path
        url
        relevanceId
        ...MultidisciplinaryArticleList_Parent
      }
      meta {
        metaDescription
        metaImage {
          url
          alt
        }
      }
      supportedLanguages
      context {
        contextId
        breadcrumbs
        parentIds
        path
        url
        parents {
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
          copyright {
            ...CopyrightInfo
          }
        }
        transformedContent(transformArgs: $transformArgs) {
          visualElementEmbed {
            content
          }
        }
        revisionDate
      }
      ...Resources_Parent
    }
    ${MultidisciplinaryArticleList.fragments.parent}
    ${Resources.fragments.parent}
    ${copyrightInfoFragment}
  `,
  resourceType: gql`
    fragment Topic_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default SubjectTopic;
