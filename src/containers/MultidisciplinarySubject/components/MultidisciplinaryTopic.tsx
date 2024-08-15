/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { TFunction } from "i18next";
import { ReactNode, useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { extractEmbedMeta } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import { AuthContext } from "../../../components/AuthenticationContext";
import { NavigationBox } from "../../../components/NavigationBox";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import Topic from "../../../components/Topic/Topic";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLMultidisciplinaryTopic_SubjectFragment,
  GQLMultidisciplinaryTopic_TopicFragment,
} from "../../../graphqlTypes";
import { toTopic, useUrnIds } from "../../../routeHelpers";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import Resources from "../../Resources/Resources";
import TopicVisualElementContent from "../../SubjectPage/components/TopicVisualElementContent";

interface Props {
  topicId: string;
  subjectId: string;
  subTopicId?: string;
  subject: GQLMultidisciplinaryTopic_SubjectFragment;
  topic: GQLMultidisciplinaryTopic_TopicFragment;
  loading?: boolean;
  disableNav?: boolean;
  children?: ReactNode;
}

const getDocumentTitle = (name: string, t: TFunction) => {
  return htmlTitle(name, [t("htmlTitles.titleTemplate")]);
};

const MultidisciplinaryTopic = ({ topicId, subjectId, subTopicId, topic, subject, disableNav, children }: Props) => {
  const { t } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { topicList } = useUrnIds();

  useEffect(() => {
    if (!topic?.article || !authContextLoaded) return;
    const dimensions = getAllDimensions({
      article: topic.article,
      filter: subject.name,
      user,
    });

    trackPageView({ dimensions, title: getDocumentTitle(topic.name, t) });
  }, [authContextLoaded, subject, t, topic.article, topic.name, topic.path, trackPageView, user]);

  const embedMeta = useMemo(() => {
    if (!topic.article?.transformedContent?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(topic.article.transformedContent.visualElementEmbed.content);
    return embedMeta;
  }, [topic?.article?.transformedContent?.visualElementEmbed?.content]);

  const visualElement = useMemo(() => {
    if (!embedMeta) return undefined;
    return <TopicVisualElementContent embed={embedMeta} />;
  }, [embedMeta]);

  const topicPath = topic.path
    ?.split("/")
    .slice(2)
    .map((id) => `urn:${id}`);
  const subTopics =
    topic.subtopics?.map((item) => ({
      id: item.id,
      label: item.name,
      selected: item.id === subTopicId,
      url: toTopic(subjectId, ...(topicPath ?? []), item.id),
    })) ?? [];

  if (!topic.article) {
    return null;
  }

  return (
    <>
      {topicId === topicList[topicList.length - 1] && (
        <>
          <Helmet>
            <title>{htmlTitle(topic.name ?? topic.meta?.title, [subject.name, t("htmlTitles.titleTemplate")])}</title>
          </Helmet>
          <SocialMediaMetadata
            title={htmlTitle(topic.name ?? topic.meta?.title, [subject.name, t("htmlTitles.titleTemplate")])}
            description={topic.meta?.metaDescription ?? topic.meta?.introduction}
            imageUrl={topic.meta?.metaImage?.url}
          />
        </>
      )}
      <Topic
        id={topicId === topicList[topicList.length - 1] ? SKIP_TO_CONTENT_ID : undefined}
        title={parse(topic.article.htmlTitle ?? "")}
        introduction={parse(topic.article.htmlIntroduction ?? "")}
        visualElementEmbedMeta={embedMeta}
        visualElement={visualElement}
      >
        {disableNav ? null : <NavigationBox colorMode="light" heading={t("navigation.topics")} items={subTopics} />}
        {children}
      </Topic>
    </>
  );
};

export const multidisciplinaryTopicFragments = {
  topic: gql`
    fragment MultidisciplinaryTopic_Topic on Topic {
      path
      subtopics {
        id
        name
      }
      meta {
        title
        metaDescription
        introduction
        metaImage {
          url
        }
      }
      article {
        oembed
        htmlTitle
        htmlIntroduction
        grepCodes
        metaImage {
          url
          alt
        }
        transformedContent(transformArgs: $transformArgs) {
          visualElementEmbed {
            content
          }
        }
      }
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
  subject: gql`
    fragment MultidisciplinaryTopic_Subject on Subject {
      id
      name
    }
  `,
};

export default MultidisciplinaryTopic;
