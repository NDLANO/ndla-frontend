/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { gql } from "@apollo/client";
import { ArrowLeftLine } from "@ndla/icons";
import { Button, PageContent } from "@ndla/primitives";
import { useTracker } from "@ndla/tracker";
import { constants } from "@ndla/ui";
import PostResizeMessage from "./PostResizeMessage";
import Article from "../components/Article";
import { CreatedBy } from "../components/Article/CreatedBy";
import { useLtiData } from "../components/LtiContext";
import { useEnablePrettyUrls } from "../components/PrettyUrlsContext";
import SocialMediaMetadata from "../components/SocialMediaMetadata";
import config from "../config";
import { GQLIframeArticlePage_ArticleFragment, GQLIframeArticlePage_NodeFragment } from "../graphqlTypes";
import { LocaleType } from "../interfaces";
import { getArticleScripts } from "../util/getArticleScripts";
import { getContentType } from "../util/getContentType";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../util/getStructuredDataFromArticle";
import { getAllDimensions } from "../util/trackingUtil";
import { transformArticle } from "../util/transformArticle";

interface Props {
  locale?: LocaleType;
  node?: GQLIframeArticlePage_NodeFragment;
  article: GQLIframeArticlePage_ArticleFragment;
}

const getDocumentTitle = ({ article }: Pick<Props, "article">) => {
  if (article?.id) {
    return `NDLA | ${article.title}`;
  }
  return "";
};

const IframeArticlePage = ({ node, article: propArticle, locale: localeProp }: Props) => {
  const { trackPageView } = useTracker();
  const navigate = useNavigate();
  const ltiData = useLtiData();
  const { t, i18n } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const locale = localeProp ?? i18n.language;

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, locale, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        isOembed: true,
        articleLanguage: propArticle.language,
        contentType: getContentType(node),
      }),
      getArticleScripts(propArticle, locale),
    ];
  }, [propArticle, locale, node]);

  useEffect(() => {
    if (propArticle?.id) return;
    const dimensions = getAllDimensions({ article: propArticle });
    trackPageView({
      dimensions,
      title: getDocumentTitle({ article: propArticle }),
    });
  }, [propArticle, node, trackPageView]);

  const path = enablePrettyUrls ? node?.url : node?.path;
  const contentUrl = path ? `${config.ndlaFrontendDomain}${path}` : undefined;

  const contentType =
    article.articleType === "standard"
      ? getContentType(node)
      : article.articleType === "topic-article"
        ? constants.contentTypes.TOPIC
        : undefined;
  return (
    <PageContent variant="content">
      <Helmet>
        <title>{getDocumentTitle({ article: propArticle })}</title>
        <meta name="robots" content="noindex, nofollow" />
        {scripts.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(propArticle, i18n.language))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        imageUrl={article.metaImage?.url}
        description={article.metaDescription}
        trackableContent={article}
      />
      <PostResizeMessage />
      <main>
        {!!ltiData && (
          <Button variant="link" onClick={() => navigate(-1)}>
            <ArrowLeftLine />
            {t("lti.goBack")}
          </Button>
        )}
        <Article
          article={article}
          isTopicArticle={article.articleType === "topic-article"}
          isOembed
          oembed={article?.oembed}
          contentType={contentType}
          contentTypeLabel={node?.resourceTypes?.[0]?.name}
        >
          <CreatedBy name={t("createdBy.content")} description={t("createdBy.text")} url={contentUrl} />
        </Article>
      </main>
    </PageContent>
  );
};

export const iframeArticlePageFragments = {
  article: gql`
    fragment IframeArticlePage_Article on Article {
      articleType
      created
      updated
      metaDescription
      oembed
      metaImage {
        url
      }
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${Article.fragments.article}
    ${structuredArticleDataFragment}
  `,
  node: gql`
    fragment IframeArticlePage_Node on Node {
      id
      name
      path
      url
      resourceTypes {
        id
        name
      }
    }
  `,
};

export default IframeArticlePage;
