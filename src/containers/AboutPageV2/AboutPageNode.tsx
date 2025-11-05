/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { TFunction } from "i18next";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import {
  AccordionRoot,
  CardContent,
  CardHeading,
  CardRoot,
  Heading,
  PageContainer,
  PageContent,
  Text,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { useTracker } from "@ndla/tracker";
import {
  ArticleBylineAccordionItem,
  ArticleContent,
  ArticleWrapper,
  HomeBreadcrumb,
  licenseAttributes,
} from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { LdJson } from "../../components/LdJson";
import { LicenseBox } from "../../components/license/LicenseBox";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { TransportationPageHeader } from "../../components/TransportationPage/TransportationPageHeader";
import { TransportationPageNodeListGrid } from "../../components/TransportationPage/TransportationPageNodeListGrid";
import { TransportationPageVisualElement } from "../../components/TransportationPage/TransportationPageVisualElement";
import config from "../../config";
import { ABOUT_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLAboutPageNode_ArticleFragment, GQLAboutPageNode_FrontpageMenuFragment } from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { toAbout } from "../../routeHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

const StyledPageContent = styled(PageContent, {
  base: {
    paddingBlockStart: "xxlarge",
    gap: "xxlarge",
    background: "surface.brand.1.subtle",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    width: "2/3",
    tabletWideDown: {
      width: "100%",
    },
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    overflowX: "hidden",
    paddingBlockStart: "0",
  },
});

const StyledArticleContent = styled(ArticleContent, {
  base: {
    overflowX: "visible",
    marginInlineEnd: "auto",
    width: "2/3",
    tabletWideDown: {
      width: "100%",
    },
  },
});

const NodeGridWrapper = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const HeaderWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    paddingBlockEnd: "medium",
  },
});

const StyledTransportationPageNodeListGrid = styled(TransportationPageNodeListGrid, {
  base: {
    paddingBlockEnd: "xxlarge",
    paddingBlockStart: "medium",
  },
});

interface Props {
  article: GQLAboutPageNode_ArticleFragment;
  menuItems: GQLAboutPageNode_FrontpageMenuFragment[];
  crumbs: Breadcrumb[];
}

const getDocumentTitle = (t: TFunction, title: string) => t("htmlTitles.aboutPage", { name: title });

export const AboutPageNode = ({ article, menuItems, crumbs }: Props) => {
  const { t, i18n } = useTranslation();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const oembedUrl = `${config.ndlaFrontendDomain}/oembed?url=${config.ndlaFrontendDomain}/article/${article.id}`;

  useEffect(() => {
    if (article && authContextLoaded) {
      const dimensions = getAllDimensions({ user });
      trackPageView({ dimensions, title: getDocumentTitle(t, article.title) });
    }
  }, [article, authContextLoaded, t, trackPageView, user]);

  const [transformedArticle, scripts] = useMemo(() => {
    const transformedArticle = transformArticle(article, i18n.language, {
      path: `${config.ndlaFrontendDomain}${ABOUT_PATH}/${article.slug}`,
      articleLanguage: article.language,
    });
    return [
      {
        ...transformedArticle,
        introduction: transformedArticle.introduction ?? "",
      },
      getArticleScripts(article, i18n.language),
    ];
  }, [article, i18n.language])!;

  const licenseProps = licenseAttributes(article.copyright?.license?.license, i18n.language, undefined);

  return (
    <main>
      <title>{`${getDocumentTitle(t, article.title)}`}</title>
      <meta name="pageid" content={`${article.id}`} />
      {scripts?.map((script) => (
        <script key={script.src} src={script.src} type={script.type} async={script.async} defer={script.defer} />
      ))}
      <link rel="alternate" type="application/json+oembed" href={oembedUrl} title={article.title} />
      <LdJson article={article} breadcrumbItems={crumbs} />
      <SocialMediaMetadata
        title={transformedArticle.title}
        description={transformedArticle.metaDescription}
        imageUrl={transformedArticle.metaImage?.url}
        trackableContent={transformedArticle}
      />
      <StyledPageContent>
        <HomeBreadcrumb items={crumbs} />
        <TransportationPageHeader>
          <HeaderWrapper>
            <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium" tabIndex={-1}>
              {article.title}
            </Heading>
            {!!article.htmlIntroduction?.length && (
              <Text textStyle="body.large" asChild consumeCss>
                <div>{parse(article.htmlIntroduction)}</div>
              </Text>
            )}
          </HeaderWrapper>
          <TransportationPageVisualElement metaImage={article?.metaImage} />
        </TransportationPageHeader>
      </StyledPageContent>
      <StyledPageContainer>
        <ArticleWrapper {...licenseProps}>
          <StyledArticleContent>{transformedArticle.transformedContent.content}</StyledArticleContent>
        </ArticleWrapper>
        <NodeGridWrapper aria-label={t("aboutPage.menuItems")}>
          <StyledTransportationPageNodeListGrid context="node">
            {menuItems.map((item) => (
              <CardRoot key={item.articleId} asChild consumeCss>
                <li>
                  <CardContent>
                    <CardHeading asChild css={linkOverlay.raw()}>
                      <SafeLink to={toAbout(item.article.slug)}>{item.article.title}</SafeLink>
                    </CardHeading>
                    {!!item.article.metaDescription.length && (
                      <Text textStyle="body.large">{item.article.metaDescription}</Text>
                    )}
                  </CardContent>
                </li>
              </CardRoot>
            ))}
          </StyledTransportationPageNodeListGrid>
        </NodeGridWrapper>
        <StyledAccordionRoot multiple>
          <ArticleBylineAccordionItem accordionTitle={t("article.useContent")} value="rulesForUse">
            <LicenseBox
              article={article}
              copyText={article.transformedContent.metaData?.copyText}
              oembed={article.oembed}
            />
          </ArticleBylineAccordionItem>
        </StyledAccordionRoot>
      </StyledPageContainer>
    </main>
  );
};

AboutPageNode.fragments = {
  article: gql`
    fragment AboutPageNode_Article on Article {
      id
      title
      introduction
      htmlIntroduction
      slug
      language
      created
      updated
      published
      oembed
      metaImage {
        url
        alt
      }
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
    fragment AboutPageNode_FrontpageMenu on FrontpageMenu {
      articleId
      article {
        id
        title
        slug
        metaDescription
      }
    }
  `,
};
