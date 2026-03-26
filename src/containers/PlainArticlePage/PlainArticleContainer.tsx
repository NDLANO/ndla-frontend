/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { ArrowLeftLine } from "@ndla/icons";
import { Hero, HeroBackground, PageContent } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { TFunction } from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Article } from "../../components/Article/Article";
import { LdJson } from "../../components/LdJson";
import { PageTitle } from "../../components/PageTitle";
import { RootPageContent } from "../../components/Resource/ResourceLayout";
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
  revision: number | undefined;
  skipToContentId?: string;
}

const LinksContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
    backgroundColor: "background.default",
    boxShadow: " xsmall",
    padding: "medium",
    desktopDown: {
      borderRadius: "xsmall",
    },
  },
});

const StyledSafeLink = styled(SafeLink, {
  base: {
    display: "flex",
    gap: "xxsmall",
    width: "fit-content",
    textDecoration: "underline",
    _hover: {
      textDecoration: "none",
    },
  },
});

const getDocumentTitle = (t: TFunction, title: string) => htmlTitle(title, [t("htmlTitles.titleTemplate")]);

export const PlainArticleContainer = ({ article: propArticle, revision, skipToContentId }: Props) => {
  const { t, i18n } = useTranslation();

  const [article, scripts] = useMemo(() => {
    return [
      transformArticle(propArticle, i18n.language, {
        path: `${config.ndlaFrontendDomain}/article/${propArticle.id}`,
        articleLanguage: propArticle.language,
      }),
      getArticleScripts(propArticle),
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
        <Hero variant="brand1Subtle">
          <HeroBackground />
          <RootPageContent variant="article" asChild consumeCss>
            <main>
              {!!revision && (
                <LinksContainer>
                  <StyledSafeLink to={`/revisions/${article.id}`}>
                    <ArrowLeftLine />
                    {t("revision.backToRevisions")}
                  </StyledSafeLink>
                </LinksContainer>
              )}
              <PageContent variant="content" asChild>
                <Article id={skipToContentId} article={article} revision={revision} />
              </PageContent>
            </main>
          </RootPageContent>
        </Hero>
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
