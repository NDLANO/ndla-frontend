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
import { Heading, Hero, HeroBackground } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HelmetWithTracker, useTracker } from "@ndla/tracker";
import { ProgrammeV2, OneColumn, ArticleWrapper, ArticleContent } from "@ndla/ui";
import Programmes from "./Components/Programmes";
import { AuthContext } from "../../components/AuthenticationContext";
import LicenseBox from "../../components/license/LicenseBox";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import config from "../../config";
import { PROGRAMME_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFrontpageDataQuery, GQLProgrammePage } from "../../graphqlTypes";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { useGraphQuery } from "../../util/runQueries";
import { getAllDimensions } from "../../util/trackingUtil";
import { transformArticle } from "../../util/transformArticle";

const StyledMain = styled("main", {
  base: {
    paddingBlockEnd: "3xlarge",
  },
});

const ContentWrapper = styled("div", {
  base: {
    paddingBlockStart: "medium",
  },
});

const StyledOneColumn = styled(OneColumn, {
  base: {
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

export const programmeFragment = gql`
  fragment ProgrammeFragment on ProgrammePage {
    id
    title {
      title
      language
    }
    desktopImage {
      url
      alt
    }
    mobileImage {
      url
      alt
    }
    url
  }
`;

const frontpageQuery = gql`
  query frontpageData($transformArgs: TransformedArticleContentInput) {
    programmes {
      ...ProgrammeFragment
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
  ${programmeFragment}
`;

const formatProgrammes = (data: GQLProgrammePage[]): ProgrammeV2[] => {
  return data.map((p) => {
    return {
      id: p.id,
      title: p.title,
      wideImage: {
        src: p.desktopImage?.url || "",
        alt: p.desktopImage?.alt || "",
      },
      narrowImage: {
        src: p.mobileImage?.url || "",
        alt: p.mobileImage?.alt || "",
      },
      url: `${PROGRAMME_PATH}${p.url}` || "",
    };
  });
};

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

  const programmes = useMemo(() => {
    if (fpQuery.data?.programmes) {
      return formatProgrammes(fpQuery.data.programmes);
    }
    return [];
  }, [fpQuery.data?.programmes]);

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
        <Hero absolute={false} variant="brand1">
          <StyledHeroBackground>
            <StyledOneColumn wide data-testid="programme-list">
              <Programmes programmes={programmes} />
            </StyledOneColumn>
          </StyledHeroBackground>
        </Hero>
        {article && (
          <ContentWrapper>
            <OneColumn wide>
              <ArticleWrapper id={SKIP_TO_CONTENT_ID}>
                <ArticleContent padded>{article.transformedContent.content}</ArticleContent>
              </ArticleWrapper>
            </OneColumn>
          </ContentWrapper>
        )}
      </StyledMain>
    </>
  );
};

export default WelcomePage;
