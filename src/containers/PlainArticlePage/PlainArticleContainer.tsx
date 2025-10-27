/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { useTracker } from "@ndla/tracker";
import { Article } from "../../components/Article/Article";
import { AuthContext } from "../../components/AuthenticationContext";
import { LdJson } from "../../components/LdJson";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLPlainArticleContainer_ArticleFragment } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

interface Props {
  article: GQLPlainArticleContainer_ArticleFragment;
  skipToContentId?: string;
}

const getDocumentTitle = (t: TFunction, title: string) => htmlTitle(title, [t("htmlTitles.titleTemplate")]);

export const PlainArticleContainer = ({ article: propArticle, skipToContentId }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      try {
        window.MathJax.typesetPromise();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (!propArticle || !authContextLoaded) return;
    const dimensions = getAllDimensions({ user });
    trackPageView({
      dimensions,
      title: getDocumentTitle(t, propArticle.title),
    });
  }, [authContextLoaded, propArticle, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  if (!article) return <NotFoundPage />;
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${article.id}`;

  return (
    <div>
      <title>{`${getDocumentTitle(t, article.title)}`}</title>
      <meta name="robots" content="noindex, nofollow" />
      {scripts.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      {!!oembedUrl && <link rel="alternate" type="application/json+oembed" href={oembedUrl} title={article.title} />}
      <LdJson article={propArticle} />
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        trackableContent={article}
      />
      <PageContent variant="content">
        <Article id={skipToContentId} article={article} />
      </PageContent>
    </div>
  );
};

export const plainArticleContainerFragments = {
  article: gql`
    fragment PlainArticleContainer_Article on Article {
      created
      tags
      ...Article_Article
      ...StructuredArticleData
    }
    ${structuredArticleDataFragment}
    ${Article.fragments.article}
  `,
};
