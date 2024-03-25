/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { DynamicComponents } from "@ndla/article-converter";
import { useTracker } from "@ndla/tracker";
import { OneColumn } from "@ndla/ui";
import Article from "../../components/Article";
import { AuthContext } from "../../components/AuthenticationContext";
import AddEmbedToFolder from "../../components/MyNdla/AddEmbedToFolder";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLPlainArticleContainer_ArticleFragment } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";
import NotFoundPage from "../NotFoundPage/NotFoundPage";

interface Props {
  article: GQLPlainArticleContainer_ArticleFragment;
  skipToContentId?: string;
}

const converterComponents: DynamicComponents = {
  heartButton: AddEmbedToFolder,
};

const getDocumentTitle = (t: TFunction, title: string) => htmlTitle(title, [t("htmlTitles.titleTemplate")]);

const PlainArticleContainer = ({ article: propArticle, skipToContentId }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  useEffect(() => {
    if (!propArticle || !authContextLoaded) return;
    const dimensions = getAllDimensions({ article: propArticle, user });
    trackPageView({
      dimensions,
      title: getDocumentTitle(t, propArticle.title),
    });
  }, [authContextLoaded, propArticle, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        components: converterComponents,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle, i18n.language),
    ];
  }, [propArticle, i18n.language]);

  if (!article) return <NotFoundPage />;
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${article.id}`;

  return (
    <div>
      <Helmet>
        <title>{`${getDocumentTitle(t, article.title)}`}</title>
        <meta name="robots" content="noindex" />
        {scripts.map((script) => (
          <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
        ))}
        {oembedUrl && <link rel="alternate" type="application/json+oembed" href={oembedUrl} title={article.title} />}

        <script type="application/ld+json">
          {JSON.stringify(getStructuredDataFromArticle(propArticle, i18n.language))}
        </script>
      </Helmet>
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        trackableContent={article}
      />
      <OneColumn>
        <Article contentTransformed isPlainArticle id={skipToContentId} article={article} oembed={undefined} label="" />
      </OneColumn>
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
export default PlainArticleContainer;
