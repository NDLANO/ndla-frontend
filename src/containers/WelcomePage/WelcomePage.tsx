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
import { Heading, Hero, HeroBackground, PageContent } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ArticleWrapper, ArticleContent } from "@ndla/ui";
import Programmes from "./Components/Programmes";
import { AuthContext } from "../../components/AuthenticationContext";
import LicenseBox from "../../components/license/LicenseBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFrontpageDataQuery } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

const StyledMain = styled("main", {
  base: {
    paddingBlockEnd: "5xlarge",
  },
});

const ContentWrapper = styled("div", {
  base: {
    paddingBlockStart: "medium",
  },
});

const StyledPageContent = styled(PageContent, {
  base: {
    width: "100%",
    paddingBlockStart: "medium",
    paddingBlockEnd: "surface.4xsmall",
  },
});

const StyledHeroBackground = styled(HeroBackground, {
  base: {
    display: "flex",
    justifyContent: "center",
    height: "unset",
  },
});

const frontpageQuery = gql`
  query frontpageData($transformArgs: TransformedArticleContentInput) {
    programmes {
      ...Programmes_ProgrammePage
    }
    frontpage {
      articleId
      article {
        id
        introduction
        created
        updated
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
    }
  }
  ${LicenseBox.fragments.article}
  ${structuredArticleDataFragment}
  ${Programmes.fragments.programmePage}
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
        imageUrl={`${config.ndlaFrontendDomain}/static/logo.png`}
      >
        <meta name="keywords" content={t("meta.keywords")} />
      </SocialMediaMetadata>
      <StyledMain>
        <Hero absolute={false} variant="brand1Subtle">
          <StyledHeroBackground>
            <StyledPageContent data-testid="programme-list">
              <Programmes programmes={fpQuery.data?.programmes ?? []} />
            </StyledPageContent>
          </StyledHeroBackground>
        </Hero>
        {article && (
          <ContentWrapper>
            <PageContent>
              <ArticleWrapper id={SKIP_TO_CONTENT_ID}>
                <ArticleContent>{article.transformedContent.content}</ArticleContent>
              </ArticleWrapper>
            </PageContent>
          </ContentWrapper>
        )}
      </StyledMain>
    </>
  );
};

export default WelcomePage;
