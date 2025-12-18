/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { gql } from "@apollo/client";
import { ArrowLeftLine } from "@ndla/icons";
import { Button, PageContent } from "@ndla/primitives";
import { PostResizeMessage } from "./PostResizeMessage";
import { Article } from "../components/Article/Article";
import { CreatedBy } from "../components/Article/CreatedBy";
import { BannerAlerts } from "../components/BannerAlerts";
import { LdJson } from "../components/LdJson";
import { useLtiData } from "../components/LtiContext";
import { PageTitle } from "../components/PageTitle";
import { RestrictedBlockContextProvider } from "../components/RestrictedBlock";
import { SocialMediaMetadata } from "../components/SocialMediaMetadata";
import config from "../config";
import { GQLIframeArticlePage_ArticleFragment, GQLIframeArticlePage_NodeFragment } from "../graphqlTypes";
import { LocaleType } from "../interfaces";
import { getArticleScripts } from "../util/getArticleScripts";
import { structuredArticleDataFragment } from "../util/getStructuredDataFromArticle";
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

export const IframeArticlePage = ({ node, article: propArticle, locale: localeProp }: Props) => {
  const navigate = useNavigate();
  const ltiData = useLtiData();
  const { t, i18n } = useTranslation();
  const locale = localeProp ?? i18n.language;

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, locale, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        isOembed: true,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle, locale),
    ];
  }, [propArticle, locale]);

  const url = node?.url;
  const contentUrl = url ? `${config.ndlaFrontendDomain}${url}` : undefined;

  return (
    <>
      <PageTitle title={getDocumentTitle({ article: propArticle })} />
      <meta name="robots" content="noindex, nofollow" />
      {scripts.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      <LdJson article={propArticle} />
      <SocialMediaMetadata
        title={article.title}
        imageUrl={article.metaImage?.image.imageUrl}
        description={article.metaDescription}
        trackableContent={article}
      />
      <PostResizeMessage />
      <main>
        <BannerAlerts />
        {!!ltiData && (
          <Button variant="link" onClick={() => navigate(-1)}>
            <ArrowLeftLine />
            {t("lti.goBack")}
          </Button>
        )}
        <RestrictedBlockContextProvider value="bleed">
          <PageContent variant="content" asChild>
            <Article
              article={article}
              isTopicArticle={article.articleType === "topic-article"}
              isOembed
              resourceTypes={node?.resourceTypes}
              relevanceId={node?.relevanceId}
            >
              <CreatedBy name={t("createdBy.content")} description={t("createdBy.text")} url={contentUrl} />
            </Article>
          </PageContent>
        </RestrictedBlockContextProvider>
      </main>
    </>
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
        image {
          imageUrl
        }
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
      nodeType
      name
      url
      relevanceId
      resourceTypes {
        id
        name
      }
    }
  `,
};
