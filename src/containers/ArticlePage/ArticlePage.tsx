/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { TFunction } from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Article } from "../../components/Article/Article";
import { ContentPlaceholder } from "../../components/ContentPlaceholder";
import { LdJson } from "../../components/LdJson";
import { PageTitle } from "../../components/PageTitle";
import { ResourceContent } from "../../components/Resource/ResourceLayout";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLArticlePage_NodeFragment, GQLTaxonomyCrumb } from "../../graphqlTypes";
import { toBreadcrumbItems } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { transformArticle } from "../../util/transformArticle";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

interface Props {
  resource: GQLArticlePage_NodeFragment | undefined;
  skipToContentId?: string;
  loading: boolean;
}

export const ArticlePage = ({ resource, skipToContentId, loading }: Props) => {
  const { t, i18n } = useTranslation();

  const crumbs = resource?.context?.parents || [];
  const root = crumbs[0];

  const [article, scripts] = useMemo(() => {
    if (!resource?.article) return [];
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

  if (!loading && (!resource?.article || !article)) {
    return <NotFoundPage />;
  }

  const breadcrumbItems = toBreadcrumbItems(t("breadcrumb.toFrontpage"), [...crumbs, resource]);

  return (
    <>
      {!!resource && !!resource.article && !!article && (
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
            imageUrl={article.metaImage?.image.imageUrl}
            path={resource.url}
          />
        </>
      )}
      {loading ? (
        <ResourceContent variant="content">
          <ContentPlaceholder variant="article" />
        </ResourceContent>
      ) : !!resource && !!article && resource.article ? (
        <ResourceContent variant="content" asChild>
          <Article
            id={skipToContentId ?? article.id.toString()}
            path={resource.url}
            article={article}
            subjectId={root?.id}
            isInactive={!!resource.context?.isArchived}
            resourceTypes={resource.resourceTypes}
            relevanceId={resource.relevanceId}
          />
        </ResourceContent>
      ) : null}
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
