/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { AccordionRoot, Heading, Hero, HeroBackground, HeroContent, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import {
  ArticleContent,
  ArticleFooter,
  ArticleHeader,
  ArticleWrapper,
  HomeBreadcrumb,
  ArticleBylineAccordionItem,
  licenseAttributes,
} from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { LdJson } from "../../components/LdJson";
import LicenseBox from "../../components/license/LicenseBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { SKIP_TO_CONTENT_ID, ABOUT_PATH } from "../../constants";
import { GQLAboutPageLeaf_ArticleFragment } from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

interface Props {
  article: GQLAboutPageLeaf_ArticleFragment;
  crumbs: Breadcrumb[];
}

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

const StyledArticleContent = styled(ArticleContent, {
  base: {
    overflowX: "visible",
  },
});

const getDocumentTitle = (t: TFunction, title: string) => t("htmlTitles.aboutPage", { name: title });

export const AboutPageLeaf = ({ article: _article, crumbs }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${_article.id}`;

  useEffect(() => {
    if (_article && authContextLoaded) {
      const dimensions = getAllDimensions({ user });
      trackPageView({ dimensions, title: getDocumentTitle(t, _article.title) });
    }
  }, [_article, authContextLoaded, t, trackPageView, user]);

  const [article, scripts] = useMemo(() => {
    const transformedArticle = transformArticle(_article, i18n.language, {
      path: `${config.ndlaFrontendDomain}${ABOUT_PATH}/${_article.slug}`,
      articleLanguage: _article.language,
    });
    return [
      {
        ...transformedArticle,
        copyright: {
          ..._article.copyright,
          processed: _article.copyright.processed ?? false,
        },
        introduction: transformedArticle.introduction ?? "",
      },
      getArticleScripts(_article, i18n.language),
    ];
  }, [_article, i18n.language])!;

  useEffect(() => {
    if (window.MathJax && typeof window.MathJax.typeset === "function") {
      try {
        window.MathJax.typeset();
      } catch (err) {
        // do nothing
      }
    }
  });

  const licenseProps = licenseAttributes(article.copyright?.license?.license, i18n.language, undefined);

  return (
    <main>
      <title>{`${getDocumentTitle(t, article.title)}`}</title>
      <meta name="pageid" content={`${article.id}`} />
      {scripts?.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      <link rel="alternate" type="application/json+oembed" href={oembedUrl} title={article.title} />
      <LdJson article={_article} breadcrumbItems={crumbs} />
      <SocialMediaMetadata
        title={article.title}
        description={article.metaDescription}
        imageUrl={article.metaImage?.url}
        trackableContent={article}
      />
      <Hero variant="primary">
        <HeroBackground />
        <PageContent variant="article">
          <StyledHeroContent>
            <HomeBreadcrumb items={crumbs} />
          </StyledHeroContent>
        </PageContent>
        <StyledPageContent variant="article" gutters="tabletUp">
          <PageContent variant="content" asChild>
            <ArticleWrapper {...licenseProps}>
              <ArticleHeader>
                <Heading id={SKIP_TO_CONTENT_ID} tabIndex={-1}>
                  {article.transformedContent.title}
                </Heading>
                {!!article.transformedContent.introduction && (
                  <Text textStyle="body.xlarge">{article.transformedContent.introduction}</Text>
                )}
              </ArticleHeader>
              <StyledArticleContent>{article.transformedContent.content}</StyledArticleContent>
              <ArticleFooter>
                <AccordionRoot multiple>
                  <ArticleBylineAccordionItem accordionTitle={t("article.useContent")} value="rulesForUse">
                    <LicenseBox
                      article={article}
                      copyText={article?.transformedContent?.metaData?.copyText}
                      oembed={undefined}
                    />
                  </ArticleBylineAccordionItem>
                </AccordionRoot>
              </ArticleFooter>
            </ArticleWrapper>
          </PageContent>
        </StyledPageContent>
      </Hero>
    </main>
  );
};

AboutPageLeaf.fragments = {
  article: gql`
    fragment AboutPageLeaf_Article on Article {
      id
      introduction
      grepCodes
      htmlIntroduction
      created
      updated
      slug
      language
      published
      transformedContent(transformArgs: $transformArgs) {
        content
        metaData {
          copyText
        }
      }
      ...LicenseBox_Article
      ...StructuredArticleData
    }
    ${LicenseBox.fragments.article}
    ${structuredArticleDataFragment}
  `,
};
