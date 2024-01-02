/**
 * Copyright (c) 2020-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { TFunction } from "i18next";
import { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DynamicComponents, extractEmbedMeta } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import { Topic as UITopic } from "@ndla/ui";

import ArticleContents from "../../../components/Article/ArticleContents";
import { AuthContext } from "../../../components/AuthenticationContext";
import AddEmbedToFolder from "../../../components/MyNdla/AddEmbedToFolder";
import config from "../../../config";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLMultidisciplinaryTopic_SubjectFragment,
  GQLMultidisciplinaryTopic_TopicFragment,
} from "../../../graphqlTypes";
import { toTopic, useIsNdlaFilm, useUrnIds } from "../../../routeHelpers";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import { transformArticle } from "../../../util/transformArticle";
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
}

const getDocumentTitle = (name: string, t: TFunction) => {
  return htmlTitle(name, [t("htmlTitles.titleTemplate")]);
};

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
};

const MultidisciplinaryTopic = ({ topicId, subjectId, subTopicId, topic, subject, disableNav }: Props) => {
  const { t, i18n } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const [showContent, setShowContent] = useState(false);
  const ndlaFilm = useIsNdlaFilm();
  const { topicList } = useUrnIds();

  useEffect(() => {
    setShowContent(false);
  }, [topicId]);

  useEffect(() => {
    if (!topic?.article || !authContextLoaded) return;
    const topicPath = topic.path
      ?.split("/")
      .slice(2)
      .map((t) => subject.allTopics?.find((topic) => topic.id.replace("urn:", "") === t));
    const dimensions = getAllDimensions(
      {
        subject,
        topicPath,
        article: topic.article,
        filter: subject.name,
        user,
      },
      undefined,
      true,
    );

    trackPageView({ dimensions, title: getDocumentTitle(topic.name, t) });
  }, [authContextLoaded, subject, t, topic.article, topic.name, topic.path, trackPageView, user]);

  const embedMeta = useMemo(() => {
    if (!topic.article?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(topic.article.visualElementEmbed.content);
    return embedMeta;
  }, [topic?.article?.visualElementEmbed?.content]);

  const visualElement = useMemo(() => {
    if (!embedMeta || !topic.article?.visualElementEmbed?.meta) return undefined;
    return <TopicVisualElementContent embed={embedMeta} metadata={topic.article?.visualElementEmbed?.meta} />;
  }, [embedMeta, topic.article?.visualElementEmbed?.meta]);

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

  return (
    <UITopic
      id={topicId === topicList[topicList.length - 1] ? SKIP_TO_CONTENT_ID : undefined}
      title={article.title}
      introduction={article.introduction}
      metaImage={article.metaImage}
      visualElementEmbedMeta={embedMeta}
      visualElement={visualElement}
      onToggleShowContent={topic.article?.content !== "" ? () => setShowContent(!showContent) : undefined}
      showContent={showContent}
      subTopics={!disableNav ? subTopics : undefined}
      isLoading={false}
      invertedStyle={ndlaFilm}
    >
      <ArticleContents article={article} scripts={scripts} modifier="in-topic" showIngress={false} />
    </UITopic>
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
        ...ArticleContents_Article
      }
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
    ${ArticleContents.fragments.article}
    ${TopicVisualElementContent.fragments.metadata}
  `,
  subject: gql`
    fragment MultidisciplinaryTopic_Subject on Subject {
      id
      name
      allTopics {
        id
        name
      }
    }
  `,
};

export default MultidisciplinaryTopic;
