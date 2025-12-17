/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { Hero, HeroBackground, HeroContent, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb } from "@ndla/ui";
import { NoSSR } from "@ndla/util";
import { Article } from "../../components/Article/Article";
import { LdJson } from "../../components/LdJson";
import { PageTitle } from "../../components/PageTitle";
import { useRestrictedMode } from "../../components/RestrictedModeContext";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLArticlePage_NodeFragment, GQLTaxonomyCrumb } from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { getContentType } from "../../util/getContentType";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { transformArticle } from "../../util/transformArticle";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";
import { Resources } from "../Resources/Resources";

interface Props {
  resource: GQLArticlePage_NodeFragment;
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

const StyledHeroContent = styled(HeroContent, {
  base: {
    "& a:focus-within": {
      outlineColor: "currentcolor",
    },
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    overflowX: "clip",
  },
});

export const ArticlePage = ({ resource, skipToContentId }: Props) => {
  const { t, i18n } = useTranslation();
  const restrictedInfo = useRestrictedMode();

  const crumbs = resource.context?.parents || [];
  const root = crumbs[0];
  const parent = crumbs[crumbs.length - 1];

  const [article, scripts] = useMemo(() => {
    if (!resource.article) return [];
    return [
      transformArticle(resource.article, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${resource.article?.id}`,
        subject: root?.id,
        articleLanguage: resource.article.language,
      }),
      getArticleScripts(resource.article, i18n.language),
    ];
  }, [resource, i18n.language, root?.id]);

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      try {
        window.MathJax.typesetPromise();
      } catch (err) {
        // do nothing
      }
    }
  });

  if (!resource.article || !article) {
    return <NotFoundPage />;
  }

  const contentType = getContentType(resource);

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, resource]);

  return (
    <>
      <PageTitle title={getDocumentTitle(t, resource, root)} />
      <title>{`${getDocumentTitle(t, resource, root)}`}</title>
      {scripts?.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      {!!resource.url && (
        <link
          rel="alternate"
          type="application/json+oembed"
          href={`${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain + resource.url}`}
          title={article.title}
        />
      )}
      {!!resource.context?.isArchived && <meta name="robots" content="noindex, nofollow" />}
      <meta name="pageid" content={`${article.id}`} />
      <LdJson article={resource.article} breadcrumbItems={breadcrumbItems} />
      <SocialMediaMetadata
        title={htmlTitle(article.title, [root?.name])}
        trackableContent={article}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        path={resource.url}
      />
      <main>
        <Hero variant="primary">
          <HeroBackground />
          <PageContent variant="article" asChild>
            <StyledHeroContent>{!!root && <HomeBreadcrumb items={breadcrumbItems} />}</StyledHeroContent>
          </PageContent>
          <StyledPageContent variant="article" gutters="tabletUp">
            <PageContent variant="content" asChild>
              <Article
                id={skipToContentId ?? article.id.toString()}
                path={resource.url}
                article={article}
                contentType={contentType}
                subjectId={root?.id}
                isInactive={!!resource.context?.isArchived}
                resourceTypes={resource.resourceTypes}
                relevanceId={resource.relevanceId}
              >
                {!!parent && !restrictedInfo.restricted && (
                  <NoSSR fallback={null}>
                    <ResourcesPageContent>
                      <Resources parentId={parent.id} rootId={root?.id} currentResourceId={resource.id} />
                    </ResourcesPageContent>
                  </NoSSR>
                )}
              </Article>
            </PageContent>
          </StyledPageContent>
        </Hero>
      </main>
    </>
  );
};

const getDocumentTitle = (
  t: TFunction,
  resource: GQLArticlePage_NodeFragment,
  root: Omit<GQLTaxonomyCrumb, "path"> | undefined,
) => htmlTitle(resource.article?.title, [root?.name, t("htmlTitles.titleTemplate")]);

ArticlePage.fragments = {
  resource: gql`
    fragment ArticlePage_Node on Node {
      id
      nodeType
      name
      url
      contentUri
      relevanceId
      resourceTypes {
        name
        id
      }
      context {
        contextId
        isArchived
        parents {
          contextId
          id
          name
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
