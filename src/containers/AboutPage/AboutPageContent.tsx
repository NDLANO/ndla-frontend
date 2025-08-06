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
import AboutPageFooter from "./AboutPageFooter";
import { findBreadcrumb } from "./aboutPageUtils";
import { AuthContext } from "../../components/AuthenticationContext";
import LicenseBox from "../../components/license/LicenseBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { SKIP_TO_CONTENT_ID, ABOUT_PATH } from "../../constants";
import { GQLAboutPage_ArticleFragment, GQLAboutPage_FrontpageMenuFragment } from "../../graphqlTypes";
import { toAbout } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import getStructuredDataFromArticle, { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

interface Props {
  article: GQLAboutPage_ArticleFragment;
  frontpage: GQLAboutPage_FrontpageMenuFragment;
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

const getBreadcrumb = (slug: string | undefined, frontpage: GQLAboutPage_FrontpageMenuFragment, t: TFunction) => {
  const crumbs = findBreadcrumb(frontpage.menu as GQLAboutPage_FrontpageMenuFragment[], slug);
  return [
    {
      name: t("breadcrumb.toFrontpage"),
      to: "/",
    },
  ].concat(
    crumbs.map((crumb) => ({
      name: crumb.article.title,
      to: toAbout(crumb.article.slug),
    })),
  );
};

const getDocumentTitle = (t: TFunction, title: string) => t("htmlTitles.aboutPage", { name: title });

const AboutPageContent = ({ article: _article, frontpage }: Props) => {
  const { user, authContextLoaded } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${_article.id}`;
  const crumbs = useMemo(() => getBreadcrumb(_article.slug, frontpage, t), [_article.slug, frontpage, t]);

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
      <script type="application/ld+json">
        {JSON.stringify(getStructuredDataFromArticle(_article, i18n.language, crumbs))}
      </script>

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
                <AboutPageFooter frontpage={frontpage} />
              </ArticleFooter>
            </ArticleWrapper>
          </PageContent>
        </StyledPageContent>
      </Hero>
    </main>
  );
};

export const aboutPageFragments = {
  article: gql`
    fragment AboutPage_Article on Article {
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
  frontpageMenu: gql`
    fragment AboutPage_FrontpageMenu on FrontpageMenu {
      ...FrontpageMenuFragment
      menu {
        ...AboutPageFooter_FrontpageMenu
      }
    }
    ${AboutPageFooter.fragments.frontpageMenu}
  `,
};

export default AboutPageContent;
