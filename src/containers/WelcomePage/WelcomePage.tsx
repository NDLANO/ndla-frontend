/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { ArrowRightLine, ChatHeartLine, ExternalLinkLine, HeartLine, MovieLine, RobotFill } from "@ndla/icons";
import { CardContent, CardHeading, CardRoot, Heading, Hero, HeroBackground, Text } from "@ndla/primitives";
import { SafeLink, SafeLinkButton } from "@ndla/safelink";
import { styled } from "@ndla/styled-system/jsx";
import { linkOverlay } from "@ndla/styled-system/patterns";
import { ArticleWrapper, ArticleContent } from "@ndla/ui";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import { PageTitle } from "../../components/PageTitle";
import { useRestrictedMode } from "../../components/RestrictedModeContext";
import { useSiteTheme } from "../../components/SiteThemeContext";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import config from "../../config";
import { FILM_PAGE_URL, PROGRAMME_PATH, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLFrontpageDataQuery } from "../../graphqlTypes";
import { routes } from "../../routeHelpers";
import { getChatRobotUrl } from "../../util/chatRobotHelpers";
import { getArticleScripts } from "../../util/getArticleScripts";
import { structuredArticleDataFragment } from "../../util/getStructuredDataFromArticle";
import { siteThemeToHeroVariant } from "../../util/siteTheme";
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
    listStyle: "none",
    gridTemplateColumns: "1fr",
    tablet: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  variants: {
    variant: {
      programme: {
        columnGap: "xsmall",
        rowGap: "small",
        desktop: {
          gridTemplateColumns: "repeat(3, 1fr)",
        },
      },
      quickLink: {
        gap: "large",
      },
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

const StyledCardHeading = styled(CardHeading, {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "xsmall",
  },
});

const StyledCardContent = styled(CardContent, {
  base: {
    paddingBlockStart: "medium",
  },
});

const StyledCardRoot = styled(CardRoot, {
  base: {
    boxShadow: "none",
    border: "1px solid",
    borderColor: "stroke.subtle",
  },
  variants: {
    theme: {
      brand1: {
        background: "surface.brand.1.subtle",
        _hover: {
          background: "surface.brand.1.subtle/60",
        },
      },
      brand2: {
        background: "surface.brand.2.subtle",
        _hover: {
          background: "surface.brand.2.subtle/60",
        },
      },
      brand3: {
        background: "surface.brand.3.subtle",
        _hover: {
          background: "surface.brand.3.subtle/60",
        },
      },
      brand4: {
        background: "surface.brand.4.subtle",
        _hover: {
          background: "surface.brand.4.subtle/60",
        },
      },
      brand5: {
        background: "surface.brand.5.subtle",
        _hover: {
          background: "surface.brand.5.subtle/60",
        },
      },
    },
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
        htmlTitle
        transformedContent(transformArgs: $transformArgs) {
          content
          metaData {
            copyText
          }
        }
        ...StructuredArticleData
      }
    }
  }
  ${structuredArticleDataFragment}
`;

export const WelcomePage = () => {
  const { t, i18n } = useTranslation();
  const { user } = useContext(AuthContext);
  const siteTheme = useSiteTheme();

  const restrictedMode = useRestrictedMode();

  const quickLinks = useMemo(() => {
    return [
      { type: "myNdla", icon: HeartLine, url: routes.myNdla.root, external: false },
      { type: "chatRobot", icon: RobotFill, url: getChatRobotUrl(user), external: true },
      { type: "arena", icon: ChatHeartLine, url: `https://${config.arenaDomain}`, external: true },
      { type: "film", icon: MovieLine, url: FILM_PAGE_URL, external: false },
    ] as const;
  }, [user]);

  const fpQuery = useQuery<GQLFrontpageDataQuery>(frontpageQuery);

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

  if (restrictedMode.restricted) {
    const regionParen = restrictedMode.region ? ` (${restrictedMode.region})` : "";
    return (
      <>
        <Heading srOnly>{t("welcomePage.heading.heading")}</Heading>
        <PageTitle title={t("htmlTitles.welcomePage")} />
        <script type="application/ld+json">{googleSearchJSONLd()}</script>
        <SocialMediaMetadata
          type="website"
          title={t("welcomePage.heading.heading")}
          description={t("meta.description")}
          imageUrl={`${config.ndlaFrontendDomain}/static/metaimage.png`}
        />
        <Hero variant={siteThemeToHeroVariant(siteTheme)}>
          <StyledHeroBackground />
          <StyledPageContainer asChild consumeCss>
            <main>
              <HeadingWrapper>
                <StyledHeading asChild consumeCss textStyle="heading.large" id="programmes-heading">
                  <h2>Begrenset innhold</h2>
                </StyledHeading>
                <Text textStyle="title.medium" fontWeight="normal">
                  Du har begrenset tilgang til innhold på grunn av din geografiske plassering. {regionParen}
                </Text>
              </HeadingWrapper>
            </main>
          </StyledPageContainer>
        </Hero>
      </>
    );
  }

  return (
    <>
      <Heading srOnly>{t("welcomePage.heading.heading")}</Heading>
      <PageTitle title={t("htmlTitles.welcomePage")} />
      <script type="application/ld+json">{googleSearchJSONLd()}</script>
      <SocialMediaMetadata
        type="website"
        title={t("welcomePage.heading.heading")}
        description={t("meta.description")}
        imageUrl={`${config.ndlaFrontendDomain}/static/metaimage.png`}
      />
      <Hero variant={siteThemeToHeroVariant(siteTheme)}>
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
              <StyledList variant="programme">
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
            <nav aria-label={t("welcomePage.quickLinks.title")} data-testid="quick-links">
              <StyledList variant="quickLink">
                {quickLinks.map((link) => (
                  <StyledCardRoot asChild consumeCss key={link.type} theme={siteTheme} nonInteractive>
                    <li>
                      <StyledCardContent>
                        <StyledCardHeading textStyle="heading.small" asChild consumeCss>
                          <SafeLink
                            to={link.url}
                            css={linkOverlay.raw()}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                          >
                            <link.icon size="large" />
                            {t(`welcomePage.quickLinks.${link.type}.title`)}
                            {link.external ? <ExternalLinkLine /> : null}
                          </SafeLink>
                        </StyledCardHeading>
                        <Text>{t(`welcomePage.quickLinks.${link.type}.description`)}</Text>
                      </StyledCardContent>
                    </li>
                  </StyledCardRoot>
                ))}
              </StyledList>
            </nav>
            {!!article && (
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

export const Component = WelcomePage;
