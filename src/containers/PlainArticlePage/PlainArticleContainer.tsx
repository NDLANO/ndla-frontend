/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { PageContent } from "@ndla/primitives";
import { Article } from "../../components/Article/Article";
import { LdJson } from "../../components/LdJson";
import { PageTitle } from "../../components/PageTitle";
import { RestrictedBlockContextProvider } from "../../components/RestrictedBlock";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { GQLPlainArticleContainer_ArticleFragment } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { htmlTitle } from "../../util/titleHelper";
import { transformArticle } from "../../util/transformArticle";
import { NotFoundPage } from "../NotFoundPage/NotFoundPage";

interface Props {
  article: GQLPlainArticleContainer_ArticleFragment;
  skipToContentId?: string;
}

const getDocumentTitle = (t: TFunction, title: string) => htmlTitle(title, [t("htmlTitles.titleTemplate")]);

export const PlainArticleContainer = ({ article: propArticle, skipToContentId }: Props) => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typesetPromise === "function") {
      try {
        window.MathJax.typesetPromise();
      } catch (err) {
        // do nothing
      }
    }
  });

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
    <>
      <PageTitle title={getDocumentTitle(t, article.title)} />
      <meta name="robots" content="noindex, nofollow" />
      {scripts.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      {!!oembedUrl && <link rel="alternate" type="application/json+oembed" href={oembedUrl} title={article.title} />}
      <LdJson article={propArticle} />
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        imageUrl={article.metaImage?.image.imageUrl}
        trackableContent={article}
      />
      <RestrictedBlockContextProvider value="bleed">
        <PageContent variant="content" asChild>
          <Article id={skipToContentId} article={article} />
        </PageContent>
      </RestrictedBlockContextProvider>
    </>
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
