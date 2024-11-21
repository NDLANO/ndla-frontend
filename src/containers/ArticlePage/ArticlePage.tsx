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
  ContentTypeHero,
  HomeBreadcrumb,
  ArticleWrapper,
  ArticleTitle,
  ArticleContent,
  ArticleFooter,
  ArticleByline,
  licenseAttributes,
} from "@ndla/ui";
import { NoSSR } from "@ndla/util";
import ArticleErrorMessage from "./components/ArticleErrorMessage";
import { RedirectExternal, Status } from "../../components";
import Article from "../../components/Article";
import { useArticleCopyText, useNavigateToHash } from "../../components/Article/articleHelpers";
import FavoriteButton from "../../components/Article/FavoritesButton";
import { AuthContext } from "../../components/AuthenticationContext";
import CompetenceGoals from "../../components/CompetenceGoals";
import LicenseBox from "../../components/license/LicenseBox";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLArticlePage_NodeFragment, GQLArticlePage_ResourceTypeFragment, GQLTaxonomyCrumb } from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import { isLearningPathResource, getLearningPathUrlFromResource } from "../Resources/resourceHelpers";
import Resources from "../Resources/Resources";

interface Props {
  resource?: GQLArticlePage_NodeFragment;
  relevance: string;
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

const ArticlePage = ({ resource, errors, skipToContentId, loading }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { trackPageView } = useTracker();

  const crumbs = resource?.context?.parents || [];
  const root = crumbs[0];
  const parent = crumbs[crumbs.length - 1];

  useEffect(() => {
    if (!loading && authContextLoaded) {
      const dimensions = getAllDimensions({
        article: resource?.article,
        filter: root?.name,
        user,
      });
      trackPageView({
        dimensions,
        title: getDocumentTitle(t, resource, root),
      });
    }
  }, [authContextLoaded, loading, resource, root, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    if (!resource?.article) return [];
    return [
      transformArticle(resource?.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${resource.article?.id}`,
        subject: root?.id,
        articleLanguage: resource.article.language,
        contentType: getContentType(resource),
      }),
      getArticleScripts(resource.article, i18n.language),
    ];
  }, [resource, i18n.language, root?.id]);

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
    return <ArticleErrorMessage status={(error as any)?.status} />;
  }

  const contentType = resource ? getContentType(resource) : undefined;

  const copyPageUrlLink = enablePrettyUrls ? resource.url : resource.path;
  const printUrl = `${config.ndlaFrontendDomain}/article-iframe/${i18n.language}/article/${resource.article.id}`;

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, resource], enablePrettyUrls);

  const authors =
    article.copyright?.creators.length || article.copyright?.rightsholders.length
      ? article.copyright.creators
      : article.copyright?.processors;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, article.language, undefined);

  return (
    <main>
      <Helmet>
        <title>{`${getDocumentTitle(t, resource, root)}`}</title>
        {scripts?.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
        {copyPageUrlLink && (
          <link
            rel="alternate"
            type="application/json+oembed"
            href={`${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain + copyPageUrlLink}`}
            title={article.title}
          />
        )}
        {!resource.context?.isActive && <meta name="robots" content="noindex, nofollow" />}
        <meta name="pageid" content={`${article.id}`} />
        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(resource.article, i18n.language, breadcrumbItems))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={htmlTitle(article.title, [root?.name])}
        trackableContent={article}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        path={copyPageUrlLink}
      />
      <ContentTypeHero contentType={contentType}>
        <HeroBackground />
        <PageContent variant="article" asChild>
          <StyledHeroContent>{root && <HomeBreadcrumb items={breadcrumbItems} />}</StyledHeroContent>
        </PageContent>
        <StyledPageContent variant="article" gutters="tabletUp">
          <PageContent variant="content" asChild>
            <ArticleWrapper {...licenseProps}>
              <ArticleTitle
                id={skipToContentId ?? article.id.toString()}
                contentType={contentType}
                contentTypeLabel={resource.resourceTypes?.[0]?.name}
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
                      subjectId={root?.id}
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
                {parent && (
                  <NoSSR fallback={null}>
                    <ResourcesPageContent>
                      <Resources
                        parentId={parent.id}
                        rootId={root?.id}
                        headingType="h2"
                        subHeadingType="h3"
                        currentResourceContentType={contentType}
                        currentResourceId={resource.id}
                      />
                    </ResourcesPageContent>
                  </NoSSR>
                )}
              </ArticleFooter>
            </ArticleWrapper>
          </PageContent>
        </StyledPageContent>
      </ContentTypeHero>
    </main>
  );
};

const getDocumentTitle = (t: TFunction, resource?: GQLArticlePage_NodeFragment, root?: GQLTaxonomyCrumb) =>
  htmlTitle(resource?.article?.title, [root?.name, t("htmlTitles.titleTemplate")]);

ArticlePage.fragments = {
  resourceType: gql`
    fragment ArticlePage_ResourceType on ResourceTypeDefinition {
      ...Resources_ResourceTypeDefinition
    }
    ${Resources.fragments.resourceType}
  `,
  resource: gql`
    fragment ArticlePage_Node on Node {
      id
      name
      path
      url
      contentUri
      resourceTypes {
        name
        id
      }
      context {
        contextId
        isActive
        parents {
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
};

export default ArticlePage;
