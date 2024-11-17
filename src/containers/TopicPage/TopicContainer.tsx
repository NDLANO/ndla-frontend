/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useContext, useEffect, useId, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { extractEmbedMeta } from "@ndla/article-converter";
import { Badge, BleedPageContent, Heading, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { HomeBreadcrumb } from "@ndla/ui";
import MultidisciplinaryArticleList from "./MultidisciplinaryArticleList";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import { useEnablePrettyUrls } from "../../components/PrettyUrlsContext";
import SocialMediaMetadata from "../../components/SocialMediaMetadata";
import { TransportationPageHeader } from "../../components/TransportationPage/TransportationPageHeader";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { TransportationPageNodeListGrid } from "../../components/TransportationPage/TransportationPageNodeListGrid";
import { TransportationPageVisualElement } from "../../components/TransportationPage/TransportationPageVisualElement";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLTopicPageQuery } from "../../graphqlTypes";
import { SubjectType } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getAllDimensions } from "../../util/trackingUtil";
import Resources from "../Resources/Resources";

const NodeGridWrapper = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledTopicWrapper = styled(PageContent, {
  base: {
    paddingBlockStart: "xxlarge",
    gap: "xxlarge",
    background: "surface.brand.1.subtle",
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

const StyledPageContainer = styled(PageContainer, {
  base: {
    overflowX: "hidden",
  },
});

const StyledTransportationPageNodeListGrid = styled(TransportationPageNodeListGrid, {
  base: {
    paddingBlockEnd: "xxlarge",
    paddingBlockStart: "medium",
  },
});

const HeadingWrapper = styled("div", {
  base: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "xsmall",
    overflowWrap: "anywhere",
  },
});

interface TopicContainerProps {
  node: NonNullable<GQLTopicPageQuery["node"]>;
  subjectType: SubjectType;
}

export const TopicContainer = ({ node, subjectType }: TopicContainerProps) => {
  const { t } = useTranslation();
  const enablePrettyUrls = useEnablePrettyUrls();
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const headingId = useId();

  const pageTitle = useMemo(
    () => htmlTitle([node.name, node.breadcrumbs[0]].filter((e) => !!e).join(" - "), [t("htmlTitles.titleTemplate")]),
    [node.breadcrumbs, node.name, t],
  );

  useEffect(() => {
    if (authContextLoaded && node.article) {
      const dimensions = getAllDimensions({
        article: node.article,
        filter: node.breadcrumbs[0],
        user,
      });
      trackPageView({ dimensions, title: pageTitle });
    }
  }, [authContextLoaded, node.article, node.breadcrumbs, pageTitle, trackPageView, user]);

  const breadcrumbs = useMemo(() => {
    if (!node.context) return [];
    return [
      {
        name: t("breadcrumb.toFrontpage"),
        to: "/",
      },
      node.context?.parents?.map((parent) => ({
        name: parent.name,
        to: (enablePrettyUrls ? parent.url : parent.path) ?? "",
      })) ?? [],

      { name: node.context.name, to: node.context.path },
    ].flat();
  }, [node, t, enablePrettyUrls]);

  const embedMeta = useMemo(() => {
    if (!node.article?.transformedContent?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(node.article.transformedContent?.visualElementEmbed.content);
    return embedMeta;
  }, [node?.article?.transformedContent?.visualElementEmbed?.content]);

  return (
    <main>
      <Helmet>
        <title>{pageTitle}</title>
        {!node.context?.isActive && <meta name="robots" content="noindex" />}
      </Helmet>
      <SocialMediaMetadata
        title={pageTitle}
        description={node.meta?.metaDescription}
        imageUrl={node.meta?.metaImage?.url}
        trackableContent={{ supportedLanguages: node.supportedLanguages }}
      />
      <StyledTopicWrapper>
        {<HomeBreadcrumb items={breadcrumbs} />}
        <TransportationPageHeader>
          <HeaderWrapper>
            <HeadingWrapper>
              <Heading id={SKIP_TO_CONTENT_ID} textStyle="heading.medium">
                {node.name}
              </Heading>
              {node.relevanceId === RELEVANCE_SUPPLEMENTARY && (
                <Badge colorTheme="neutral">{t("navigation.additionalTopic")}</Badge>
              )}
            </HeadingWrapper>
            {!!(node.article?.htmlIntroduction?.length || node.meta?.metaDescription?.length) && (
              <Text textStyle="body.large">
                {node.article?.htmlIntroduction?.length
                  ? parse(node.article.htmlIntroduction)
                  : node.meta?.metaDescription}
              </Text>
            )}
          </HeaderWrapper>
          <TransportationPageVisualElement embed={embedMeta} metaImage={node.article?.metaImage} />
        </TransportationPageHeader>
      </StyledTopicWrapper>
      <StyledPageContainer>
        {subjectType === "multiDisciplinary" && node.context?.parents?.length === 2 && !!node.nodes?.length ? (
          <MultidisciplinaryArticleList nodes={node.nodes} />
        ) : node.nodes?.length ? (
          <NodeGridWrapper aria-labelledby={headingId}>
            <Heading textStyle="heading.small" asChild consumeCss id={headingId}>
              <h2>{t("topicPage.topics")}</h2>
            </Heading>
            <StyledTransportationPageNodeListGrid>
              {node.nodes.map((node) => (
                <TransportationNode key={node.id} node={node} />
              ))}
            </StyledTransportationPageNodeListGrid>
          </NodeGridWrapper>
        ) : undefined}
        {!!node.children?.length && (
          <BleedPageContent>
            <PageContent variant="article">
              <Resources parentId={node.id} rootId={node.context?.rootId} headingType="h2" subHeadingType="h3" />
            </PageContent>
          </BleedPageContent>
        )}
      </StyledPageContainer>
    </main>
  );
};
