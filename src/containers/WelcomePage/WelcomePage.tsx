/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { ArrowRightLine } from "@ndla/icons/common";
import { Heading, Hero, HeroBackground, Text } from "@ndla/primitives";
import { SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ArticleWrapper, ArticleContent } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import LicenseBox from "../../components/license/LicenseBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { PROGRAMME_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFrontpageDataQuery } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "medium",
  },
});

const StyledHeading = styled(Heading, {
  base: {
    textAlign: "center",
  },
});

const StyledList = styled("ul", {
  base: {
    display: "grid",
    columnGap: "xsmall",
    rowGap: "small",
    listStyle: "none",
    gridTemplateColumns: "1fr",
    tablet: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    desktop: {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
  },
});

const StyledSafeLinkButton = styled(SafeLinkButton, {
  base: {
    position: "relative",
    paddingInline: "small",
    paddingBlock: "medium",
    justifyContent: "space-between",
    textAlign: "start",
    width: "100%",
    height: "4xlarge",
    _after: {
      transitionDuration: "normal",
      transitionTimingFunction: "ease-out",
      transitionProperty: "opacity",
      opacity: "0",
      inset: "0",
      borderRadius: "xsmall",
      position: "absolute",
      content: "''",
      boxShadow: "none",
    },
    // Disable this hover effect on touch devices
    "@media(pointer: fine)": {
      "&:not(:active)": {
        _hover: {
          transform: "translateY(-5px)",
          _after: {
            opacity: "1",
            boxShadow: "full",
          },
        },
      },
    },
  },
});

const StyledPageContainer = styled(PageContainer, {
  base: {
    gap: "xxlarge",
  },
});

const StyledHeroBackground = styled(HeroBackground, {
  base: {
    height: "surface.large",
  },
});

const frontpageQuery = gql`
  query frontpageData($transformArgs: TransformedArticleContentInput) {
    programmes {
      id
      title {
        title
        language
      }
      url
    }
    frontpage {
      articleId
      article {
        id
        introduction
        created
        updated
        published
        language
        transformedContent(transformArgs: $transformArgs) {
          content
          metaData {
            copyText
          }
        }
        ...LicenseBox_Article
        ...StructuredArticleData
      }
    }
  }
  ${LicenseBox.fragments.article}
  ${structuredArticleDataFragment}
`;

const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const { trackPageView } = useTracker();
  const { user, authContextLoaded } = useContext(AuthContext);

  useEffect(() => {
    if (authContextLoaded) {
      trackPageView({
        title: t("htmlTitles.welcomePage"),
        dimensions: getAllDimensions({ user }),
      });
    }
  }, [authContextLoaded, t, trackPageView, user]);

  const fpQuery = useGraphQuery<GQLFrontpageDataQuery>(frontpageQuery);

  const [article] = useMemo(() => {
    const _article = fpQuery.data?.frontpage?.article;
    if (!_article) return [undefined, undefined];
    const transformedArticle = transformArticle(_article, i18n.language, {
      path: `${config.ndlaFrontendDomain}/`,
      frontendDomain: config.ndlaFrontendDomain,
      articleLanguage: _article.language,
    });
    return [
      {
        ...transformedArticle,
        copyright: {
          ..._article.copyright,
          processed: _article.copyright.processed ?? false,
        },
      },
      getArticleScripts(_article, i18n.language),
    ];
  }, [fpQuery.data?.frontpage?.article, i18n.language])!;

  const googleSearchJSONLd = () => {
    const data = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: "https://ndla.no/",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://ndla.no/search?query={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    };
    return JSON.stringify(data);
  };

  return (
    <>
      <Heading srOnly>{t("welcomePage.heading.heading")}</Heading>
      <HelmetWithTracker title={t("htmlTitles.welcomePage")}>
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
      </HelmetWithTracker>
      <SocialMediaMetadata
        type="website"
        title={t("welcomePage.heading.heading")}
        description={t("meta.description")}
        imageUrl={`${config.ndlaFrontendDomain}/static/metaimage.png`}
      >
        <meta name="keywords" content={t("meta.keywords")} />
      </SocialMediaMetadata>
      <Hero variant="brand1Moderate">
        <StyledHeroBackground />
        <StyledPageContainer asChild consumeCss>
          <main>
            <HeadingWrapper>
              <StyledHeading asChild consumeCss textStyle="heading.large" id="programmes-heading">
                <h2>{t("programmes.header")}</h2>
              </StyledHeading>
              <Text textStyle="title.medium" fontWeight="normal">
                {t("programmes.description")}
              </Text>
            </HeadingWrapper>
            <nav aria-label={t("welcomePage.programmes")} data-testid="programme-list">
              <StyledList>
                {fpQuery.data?.programmes?.map((programme) => (
                  <li key={programme.id}>
                    <StyledSafeLinkButton to={`${PROGRAMME_PATH}${programme.url}`} variant="secondary">
                      {programme.title.title}
                      <ArrowRightLine />
                    </StyledSafeLinkButton>
                  </li>
                ))}
              </StyledList>
            </nav>
            {article && (
              <ArticleWrapper id={SKIP_TO_CONTENT_ID}>
                <ArticleContent>{article.transformedContent.content}</ArticleContent>
              </ArticleWrapper>
            )}
          </main>
        </StyledPageContainer>
      </Hero>
    </>
  );
};

export default WelcomePage;
