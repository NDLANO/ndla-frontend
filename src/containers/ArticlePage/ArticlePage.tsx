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
import { HeroBackground, HeroContent, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import {
  constants,
  ContentTypeHero,
  HomeBreadcrumb,
  ArticleWrapper,
  ArticleTitle,
  ArticleContent,
  ArticleFooter,
  ArticleByline,
  licenseAttributes,
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
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { TAXONOMY_CUSTOM_FIELD_SUBJECT_CATEGORY } from "../../constants";
import {
  GQLArticlePage_ResourceFragment,
  GQLArticlePage_ResourceTypeFragment,
  GQLArticlePage_SubjectFragment,
  GQLArticlePage_TopicFragment,
} from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { TopicPath } from "../../util/getTopicPath";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import { isLearningPathResource, getLearningPathUrlFromResource } from "../Resources/resourceHelpers";
import Resources from "../Resources/Resources";

interface Props {
  resource?: GQLArticlePage_ResourceFragment;
  topic?: GQLArticlePage_TopicFragment;
  topicPath: TopicPath[];
  relevance: string;
  subject?: GQLArticlePage_SubjectFragment;
  resourceTypes?: GQLArticlePage_ResourceTypeFragment[];
  errors?: readonly GraphQLError[];
  loading?: boolean;
  skipToContentId?: string;
}

const ResourcesPageContent = styled("div", {
  base: {
    position: "relative",
    background: "background.subtle",
    paddingBlock: "xxlarge",
    zIndex: "base",
    _after: {
      content: '""',
      position: "absolute",
      top: "0",
      bottom: "0",
      left: "-100vw",
      right: "-100vw",
      zIndex: "hide",
      background: "inherit",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    overflowX: "hidden",
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
          {topic && <Resources topic={topic} resourceTypes={resourceTypes} headingType="h2" subHeadingType="h3" />}
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

  const licenseProps = licenseAttributes(article.copyright?.license?.license, article.language, window.location.href);

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
        <PageContent variant="article" asChild>
          <StyledHeroContent>{subject && <HomeBreadcrumb items={breadcrumbItems} />}</StyledHeroContent>
        </PageContent>
        <StyledPageContent variant="article" gutters="tabletUp">
          <PageContent variant="content" asChild>
            <ArticleWrapper {...licenseProps}>
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
              <ArticleContent>{article.transformedContent.content ?? ""}</ArticleContent>
              <ArticleFooter>
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
                {topic && (
                  <ResourcesPageContent>
                    <Resources
                      topic={topic}
                      resourceTypes={resourceTypes}
                      headingType="h2"
                      subHeadingType="h3"
                      currentResourceContentType={contentType}
                    />
                  </ResourcesPageContent>
                )}
              </ArticleFooter>
            </ArticleWrapper>
          </PageContent>
        </StyledPageContent>
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
    fragment ArticlePage_Subject on Subject {
      id
      name
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
    fragment ArticlePage_Resource on Resource {
      id
      name
      path
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
    fragment ArticlePage_Topic on Topic {
      path
      ...Resources_Topic
    }
    ${Resources.fragments.topic}
  `,
};

export default ArticlePage;
