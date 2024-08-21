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
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import {
  OneColumn,
  constants,
  ContentTypeHero,
  HomeBreadcrumb,
  ArticleWrapper,
  ArticleTitle,
  ArticleContent,
  ArticleFooter,
  ArticleByline,
  ArticlePadding,
} from "@ndla/ui";
import ArticleErrorMessage from "./components/ArticleErrorMessage";
import { RedirectExternal, Status } from "../../components";
import Article from "../../components/Article";
import { useArticleCopyText, useNavigateToHash } from "../../components/Article/articleHelpers";
import FavoriteButton from "../../components/Article/FavoritesButton";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import LicenseBox from "../../components/license/LicenseBox";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import { PageSpinner } from "../../components/PageSpinner";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLArticlePageQuery,
  GQLArticlePage_ResourceFragment,
  GQLArticlePage_ResourceTypeFragment,
  GQLArticlePage_SubjectFragment,
  GQLArticlePage_TopicFragment,
  GQLTaxBase,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
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
  subjectId?: string;
  loading?: boolean;
  skipToContentId?: string;
}

const ResourcesWrapper = styled("div", {
  base: {
    background: "background.subtle",
    paddingBlockEnd: "xxlarge",
  },
});

const RelativeOneColumn = styled(OneColumn, {
  base: {
    position: "relative",
  },
});

const StyledHeroContent = styled(HeroContent, {
  base: {
    "& a:focus-within": {
      outlineColor: "currentcolor",
    },
  },
});

const ArticlePage = ({
  resource,
  topicId,
  subjectId,
  topicPath,
  topic: maybeTopic,
  resourceTypes,
  subject: maybeSubject,
  errors,
  skipToContentId,
}: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const subjectPageUrl = config.ndlaFrontendDomain;

  const { error, loading, data } = useGraphQuery<GQLArticlePageQuery>(articlePageQuery, {
    skip: (maybeTopic !== undefined && maybeSubject !== undefined) || (!topicId && !subjectId),
    variables: {
      topicId: topicId,
      subjectId: subjectId,
    },
  });

  const subject = maybeSubject || data?.subject;
  const topic = maybeTopic || data?.topic;

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
  }, [authContextLoaded, loading, resource, subject, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    if (!resource?.article) return [];
    return [
      transformArticle(resource?.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${resource.article?.id}`,
        subject: subjectId,
        articleLanguage: resource.article.language,
      }),
      getArticleScripts(resource.article, i18n.language),
    ];
  }, [subjectId, resource?.article, i18n.language])!;

  const copyText = useArticleCopyText(article);

  useNavigateToHash(article?.transformedContent.content);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  if (loading) {
    return <PageSpinner />;
  }

  if (error) {
    return null;
  }

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
            subjectId={subjectId}
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

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

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
          <StyledHeroContent>
            <HomeBreadcrumb items={breadcrumbItems} />
          </StyledHeroContent>
        </OneColumn>
        <ArticleWrapper>
          <RelativeOneColumn>
            <ArticleTitle
              id={skipToContentId ?? article.id.toString()}
              contentType={contentType}
              heartButton={
                resource.path && (
                  <AddResourceToFolderModal
                    resource={{
                      id: article.id.toString(),
                      path: resource.path,
                      resourceType: "article",
                    }}
                  >
                    <FavoriteButton path={resource.path} />
                  </AddResourceToFolderModal>
                )
              }
              title={article.transformedContent.title}
              introduction={article.transformedContent.introduction}
              competenceGoals={
                !!article.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length && (
                  <CompetenceGoals
                    codes={article.grepCodes}
                    subjectId={subject?.id}
                    supportedLanguages={article.supportedLanguages}
                  />
                )
              }
              lang={article.language === "nb" ? "no" : article.language}
            />
            <ArticleContent padded>{article.transformedContent.content ?? ""}</ArticleContent>
          </RelativeOneColumn>
          <ArticleFooter>
            <OneColumn>
              <ArticlePadding>
                <ArticleByline
                  footnotes={article.transformedContent.metaData?.footnotes ?? []}
                  authors={authors}
                  suppliers={article.copyright?.rightsholders}
                  published={article.published}
                  license={article.copyright?.license?.license ?? ""}
                  licenseBox={
                    <LicenseBox article={article} copyText={copyText} printUrl={printUrl} oembed={article.oembed} />
                  }
                />
              </ArticlePadding>
            </OneColumn>
            {topic && (
              <ResourcesWrapper>
                <OneColumn>
                  <ArticlePadding padStart padEnd>
                    <Resources
                      topicId={topicId}
                      subjectId={subjectId}
                      resourceId={resource?.id}
                      topic={topic}
                      resourceTypes={resourceTypes}
                      headingType="h2"
                      subHeadingType="h3"
                    />
                  </ArticlePadding>
                </OneColumn>
              </ResourcesWrapper>
            )}
          </ArticleFooter>
        </ArticleWrapper>
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
      name
      path
      url
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
};

const articlePageQuery = gql`
  query articlePage($topicId: String!, $subjectId: String!) {
    subject: node(id: $subjectId) {
      ...ArticlePage_Subject
    }
    topic: node(id: $topicId, rootId: $subjectId) {
      ...ArticlePage_Topic
      ...Resources_Topic
    }
  }
  ${articlePageFragments.subject}
  ${articlePageFragments.topic}
  ${Resources.fragments.topic}
`;

export default ArticlePage;
