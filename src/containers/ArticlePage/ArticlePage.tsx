/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { GraphQLError } from "graphql";
import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { HeroBackground, HeroContent } from "@ndla/primitives";
import { useTracker } from "@ndla/tracker";
import { OneColumn, LayoutItem, constants, ContentTypeHero, HomeBreadcrumb } from "@ndla/ui";
import ArticleErrorMessage from "./components/ArticleErrorMessage";
import { RedirectExternal, Status } from "../../components";
import Article from "../../components/Article";
import { AuthContext } from "../../components/AuthenticationContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLArticlePage_ResourceFragment,
  GQLArticlePage_ResourceTypeFragment,
  GQLArticlePage_SubjectFragment,
  GQLArticlePage_TopicFragment,
  GQLTaxBase,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleProps } from "../../util/getArticleProps";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import { isLearningPathResource, getLearningPathUrlFromResource } from "../Resources/resourceHelpers";
import Resources from "../Resources/Resources";

interface Props {
  resource?: GQLArticlePage_ResourceFragment;
  topic?: GQLArticlePage_TopicFragment;
  topicPath: GQLTaxBase[];
  relevance: string;
  subject?: GQLArticlePage_SubjectFragment;
  resourceTypes?: GQLArticlePage_ResourceTypeFragment[];
  errors?: readonly GraphQLError[];
  topicId?: string;
  loading?: boolean;
  skipToContentId?: string;
}

const ArticlePage = ({
  resource,
  topicId,
  topicPath,
  topic,
  resourceTypes,
  subject,
  errors,
  skipToContentId,
  loading,
}: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const subjectPageUrl = config.ndlaFrontendDomain;

  useEffect(() => {
    if (!loading && authContextLoaded) {
      const dimensions = getAllDimensions({
        article: resource?.article,
        filter: subject?.name,
        user,
      });
      trackPageView({
        dimensions,
        title: getDocumentTitle(t, resource, subject),
      });
    }
  }, [authContextLoaded, loading, resource, subject, t, topicPath, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    if (!resource?.article) return [];
    return [
      transformArticle(resource?.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${resource.article?.id}`,
        subject: subject?.id,
        articleLanguage: resource.article.language,
      }),
      getArticleScripts(resource.article, i18n.language),
    ];
  }, [subject?.id, resource?.article, i18n.language])!;

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  if (resource && isLearningPathResource(resource)) {
    const url = getLearningPathUrlFromResource(resource);
    return (
      <Status code={307}>
        <RedirectExternal to={url} />
      </Status>
    );
  }
  if (!resource?.article || !article) {
    const error = errors?.find((e) => e.path?.includes("resource"));
    return (
      <div>
        <ArticleErrorMessage
          //@ts-ignore
          status={error?.status}
        >
          <Resources
            topicId={topicId}
            subjectId={subject?.id}
            resourceId={resource?.id}
            topic={topic}
            resourceTypes={resourceTypes}
            headingType="h2"
            subHeadingType="h3"
          />
        </ArticleErrorMessage>
      </div>
    );
  }

  const contentType = resource ? getContentType(resource) : undefined;

  const copyPageUrlLink = topic ? `${subjectPageUrl}${topic.path}/${resource.id.replace("urn:", "")}` : undefined;
  const printUrl = `${subjectPageUrl}/article-iframe/${i18n.language}/article/${resource.article.id}`;

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...topicPath, resource]);

  return (
    <main>
      <Helmet>
        <title>{`${getDocumentTitle(t, resource, subject)}`}</title>
        {scripts?.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
        {copyPageUrlLink && (
          <link
            rel="alternate"
            type="application/json+oembed"
            href={`${config.ndlaFrontendDomain}/oembed?url=${copyPageUrlLink}`}
            title={article.title}
          />
        )}
        {subject?.metadata.customFields?.[TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY] ===
          constants.subjectCategories.ARCHIVE_SUBJECTS && <meta name="robots" content="noindex, nofollow" />}
        <meta name="pageid" content={`${article.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(resource.article, i18n.language, breadcrumbItems))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(article.title, [subject?.name])}
        trackableContent={article}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
      />
      <ContentTypeHero contentType={contentType}>
        <HeroBackground />
        <OneColumn>
          <HeroContent>{subject && <HomeBreadcrumb items={breadcrumbItems} />}</HeroContent>
          <Article
            path={resource.path}
            id={skipToContentId}
            article={article}
            resourceType={contentType}
            isResourceArticle
            printUrl={printUrl}
            subjectId={subject?.id}
            showFavoriteButton={config.feideEnabled}
            oembed={article.oembed}
            {...getArticleProps(resource, topic)}
          />
          <LayoutItem layout="extend">
            <Resources
              topicId={topicId}
              subjectId={subject?.id}
              resourceId={resource?.id}
              topic={topic}
              resourceTypes={resourceTypes}
              headingType="h2"
              subHeadingType="h3"
            />
          </LayoutItem>
        </OneColumn>
      </ContentTypeHero>
    </main>
  );
};

const getDocumentTitle = (
  t: TFunction,
  resource?: GQLArticlePage_ResourceFragment,
  subject?: GQLArticlePage_SubjectFragment,
) =>
  htmlTitle(resource?.article?.title, [
    subject?.subjectpage?.about?.title || subject?.name,
    t("htmlTitles.titleTemplate"),
  ]);

export const articlePageFragments = {
  resourceType: gql`
    fragment ArticlePage_ResourceType on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
  subject: gql`
    fragment ArticlePage_Subject on Node {
      id
      name
      path
      url
      metadata {
        customFields
      }
      subjectpage {
        id
        about {
          title
        }
      }
    }
  `,
  resource: gql`
    fragment ArticlePage_Resource on Node {
      id
      name
      path
      url
      contentUri
      article {
        created
        updated
        metaDescription
        oembed
        tags
        ...StructuredArticleData
        ...Article_Article
      }
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
  topic: gql`
    fragment ArticlePage_Topic on Node {
      id
      path
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
};

export default ArticlePage;
