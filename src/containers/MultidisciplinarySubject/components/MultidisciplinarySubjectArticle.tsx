/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useRef, useMemo, useEffect, useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import Article from "../../../components/Article";
import { AuthContext } from "../../../components/AuthenticationContext";
import config from "../../../config";
import {
  GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment,
  GQLMultidisciplinarySubjectArticle_SubjectFragment,
  GQLMultidisciplinarySubjectArticle_TopicFragment,
} from "../../../graphqlTypes";
import { toBreadcrumbItems } from "../../../routeHelpers";
import { getArticleScripts } from "../../../util/getArticleScripts";
import { htmlTitle } from "../../../util/titleHelper";
import { getAllDimensions } from "../../../util/trackingUtil";
import { transformArticle } from "../../../util/transformArticle";
import Resources from "../../Resources/Resources";
import MultidisciplinarySubjectHeader from "../MultidisciplinarySubjectHeader";

interface Props {
  topic: GQLMultidisciplinarySubjectArticle_TopicFragment;
  subject: GQLMultidisciplinarySubjectArticle_SubjectFragment;
  resourceTypes?: GQLMultidisciplinarySubjectArticle_ResourceTypeDefinitionFragment[];
  skipToContentId?: string;
}

const MultidisciplinarySubjectArticle = ({ topic, subject, resourceTypes, skipToContentId }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const resourcesRef = useRef(null);
  const topicPath = useMemo(
    () => topic.contexts.find((context) => context.contextId === topic.contextId)?.crumbs ?? [],
    [topic],
  );

  useEffect(() => {
    if (!topic?.article || !authContextLoaded) return;
    const dimensions = getAllDimensions({
      article: topic.article,
      filter: subject.name,
      user,
    });
    trackPageView({
      dimensions,
      title: htmlTitle(topic.name || "", [t("htmlTitles.titleTemplate")]),
    });
  }, [authContextLoaded, subject, t, topic.article, topic.name, topic.path, trackPageView, user]);

  const breadCrumbs = useMemo(() => {
    return toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...topicPath, topic]);
  }, [t, topic, topicPath]);

  const [article, scripts] = useMemo(() => {
    if (!topic.article) return [undefined, undefined];
    return [
      transformArticle(topic.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${topic.article.id}`,
        subject: subject.id,
        articleLanguage: topic.article.language,
      }),
      getArticleScripts(topic.article, i18n.language),
    ];
  }, [topic.article, i18n.language, subject.id]);

  if (!topic.article || !article) {
    return null;
  }

  const subjectLinks = topic.article.crossSubjectTopics?.map((crossSubjectTopic) => ({
    label: crossSubjectTopic.title,
    url: crossSubjectTopic.path || subject.path || "",
  }));

  return (
    <main>
      <Helmet>
        {scripts?.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
      </Helmet>
      <MultidisciplinarySubjectHeader breadcrumbs={breadCrumbs} subjectsLinks={subjectLinks} />
      <OneColumn>
        <Article
          myNdlaResourceType="multidisciplinary"
          id={skipToContentId}
          article={article}
          label=""
          isTopicArticle={false}
          isResourceArticle={false}
          showFavoriteButton
          path={topic.path}
          oembed={article.oembed}
        />
        <div ref={resourcesRef}>
          <Resources
            topicId={topic.id}
            subjectId={subject.id}
            topic={topic}
            resourceTypes={resourceTypes}
            headingType="h2"
            subHeadingType="h3"
          />
        </div>
      </OneColumn>
    </main>
  );
};

export const multidisciplinarySubjectArticleFragments = {
  topic: gql`
    fragment MultidisciplinarySubjectArticle_Topic on Node {
      path
      id
      contextId
      contexts {
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
        created
        updated
        oembed
        crossSubjectTopics(subjectId: $subjectId) {
          title
          path
        }
        ...Article_Article
      }
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
    ${Article.fragments.article}
  `,
  subject: gql`
    fragment MultidisciplinarySubjectArticle_Subject on Node {
      name
      id
      path
      subjectpage {
        id
        about {
          title
        }
      }
    }
  `,
  resourceType: gql`
    fragment MultidisciplinarySubjectArticle_ResourceTypeDefinition on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
};

export default MultidisciplinarySubjectArticle;
