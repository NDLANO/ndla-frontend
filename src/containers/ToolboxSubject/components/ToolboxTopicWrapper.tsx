/**
 * Copyright (c) 2021-present, NDLA.
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
import { Topic } from "@ndla/ui";
import { AuthContext } from "../../../components/AuthenticationContext";
import SocialMediaMetadata from "../../../components/SocialMediaMetadata";
import { SKIP_TO_CONTENT_ID } from "../../../constants";
import {
  GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment,
  GQLToolboxTopicWrapper_SubjectFragment,
  GQLToolboxTopicWrapper_TopicFragment,
} from "../../../graphqlTypes";
import { toTopic } from "../../../routeHelpers";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import Resources from "../../Resources/Resources";
import TopicVisualElementContent from "../../SubjectPage/components/TopicVisualElementContent";

interface Props {
  subject: GQLToolboxTopicWrapper_SubjectFragment;
  topic: GQLToolboxTopicWrapper_TopicFragment;
  resourceTypes?: GQLToolboxTopicWrapper_ResourceTypeDefinitionFragment[];
  topicList: Array<string>;
  index: number;
  loading?: boolean;
}

const getDocumentTitle = (name: string, t: TFunction) => {
  return htmlTitle(name, [t("htmlTitles.titleTemplate")]);
};

const ToolboxTopicWrapper = ({ subject, topicList, index, topic, resourceTypes, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const { t } = useTranslation();

  useEffect(() => {
    if (authContextLoaded && topic && index === topicList.length - 1) {
      const dimensions = getAllDimensions({
        filter: subject.name,
        article: topic.article,
        user,
      });
      trackPageView({ dimensions, title: getDocumentTitle(topic.name, t) });
    }
  }, [authContextLoaded, index, subject, t, topic, topicList, trackPageView, user]);

  const embedMeta = useMemo(() => {
    if (!topic.article?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(topic.article.visualElementEmbed?.content);
    return embedMeta;
  }, [topic?.article?.visualElementEmbed?.content]);

  const visualElement = useMemo(() => {
    if (!embedMeta || !topic.article?.visualElementEmbed?.meta) return undefined;
    return <TopicVisualElementContent embed={embedMeta} metadata={topic.article?.visualElementEmbed?.meta} />;
  }, [embedMeta, topic.article?.visualElementEmbed?.meta]);

  const resources = useMemo(() => {
    if (topic.subtopics) {
      return <Resources topic={topic} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />;
    }
    return null;
  }, [resourceTypes, topic]);

  if (!topic.article) {
    return null;
  }

  const subTopics = topic?.subtopics?.map((subtopic) => {
    const path = topic.path || "";
    const topicPath = path
      .split("/")
      .slice(2)
      .map((id) => `urn:${id}`);
    return {
      ...subtopic,
      label: subtopic.name,
      selected: subtopic.id === topicList[index + 1],
      url: toTopic(subject.id, ...topicPath, subtopic.id),
    };
  });

  return (
    <>
      {topic.id === topicList[topicList.length - 1] && (
        <>
          <Helmet>
            <title>{htmlTitle(topic.name ?? topic.meta?.title, [subject.name, t("htmlTitles.titleTemplate")])}</title>
          </Helmet>
          <SocialMediaMetadata
            title={htmlTitle(topic.name ?? topic.meta?.title, [subject.name])}
            description={
              topic.meta?.metaDescription ?? topic.meta?.introduction ?? t("frontpageMultidisciplinarySubject.text")
            }
            imageUrl={topic.meta?.metaImage?.url}
          />
        </>
      )}
      <Topic
        id={topic.id === topicList[topicList.length - 1] ? SKIP_TO_CONTENT_ID : undefined}
        frame={subTopics?.length === 0}
        isLoading={loading}
        subTopics={subTopics}
        title={topic.article.title}
        introduction={parse(topic.article.introduction ?? "")}
        metaImage={topic.article.metaImage}
        visualElementEmbedMeta={embedMeta}
        visualElement={visualElement}
        resources={resources}
      />
    </>
  );
};

export const toolboxTopicWrapperFragments = {
  subject: gql`
    fragment ToolboxTopicWrapper_Subject on Subject {
      id
      name
    }
  `,
  resourceType: gql`
    fragment ToolboxTopicWrapper_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
    }
  `,
  topic: gql`
    fragment ToolboxTopicWrapper_Topic on Topic {
      id
      name
      path
      contexts {
        breadcrumbs
        parentIds
        path
      }
      meta {
        metaDescription
        introduction
        title
        metaImage {
          url
        }
      }
      article(convertEmbeds: $convertEmbeds) {
        title
        introduction
        copyright {
          license {
            license
          }
          creators {
            name
            type
          }
          processors {
            name
            type
          }
          rightsholders {
            name
            type
          }
        }
        metaImage {
          alt
          url
        }
        visualElementEmbed {
          content
          meta {
            ...TopicVisualElementContent_Meta
          }
        }
      }
      subtopics {
        id
        name
        path
      }
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
    ${TopicVisualElementContent.fragments.metadata}
  `,
};

export default ToolboxTopicWrapper;
