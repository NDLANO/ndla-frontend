/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useContext, useEffect, useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { extractEmbedMeta } from "@ndla/article-converter";
import { Badge, BleedPageContent, Heading, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { useTracker } from "@ndla/tracker";
import { HomeBreadcrumb } from "@ndla/ui";
import { NoSSR } from "@ndla/util";
import MultidisciplinaryArticleList from "./MultidisciplinaryArticleList";
import FavoriteButton from "../../components/Article/FavoritesButton";
import { AuthContext } from "../../components/AuthenticationContext";
import { PageContainer } from "../../components/Layout/PageContainer";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
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
import { getArticleIdFromResource } from "../Resources/resourceHelpers";
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
  const { user, authContextLoaded } = useContext(AuthContext);
  const { trackPageView } = useTracker();
  const headingId = useId();
  const articleId = node.contentUri ? getArticleIdFromResource(node) : undefined;

  const metaTitle = useMemo(() => htmlTitle(node.name, [node.breadcrumbs[0]]), [node.breadcrumbs, node.name]);
  const pageTitle = useMemo(() => htmlTitle(metaTitle, [t("htmlTitles.titleTemplate")]), [metaTitle, t]);

  useEffect(() => {
    if (authContextLoaded && node.article) {
      const dimensions = getAllDimensions({ user });
      trackPageView({ dimensions, title: pageTitle });
    }
  }, [authContextLoaded, node.article, pageTitle, trackPageView, user]);

  const breadcrumbs = useMemo(() => {
    if (!node.context) return [];
    return [
      {
        name: t("breadcrumb.toFrontpage"),
        to: "/",
      },
      node.context?.parents?.map((parent) => ({
        name: parent.name,
        to: parent.url ?? "",
      })) ?? [],

      { name: node.context.name, to: node.context.url },
    ].flat();
  }, [node, t]);

  const embedMeta = useMemo(() => {
    if (!node.article?.transformedContent?.visualElementEmbed?.content) return undefined;
    const embedMeta = extractEmbedMeta(node.article.transformedContent?.visualElementEmbed.content);
    return embedMeta;
  }, [node?.article?.transformedContent?.visualElementEmbed?.content]);

  return (
    <main>
      <title>{pageTitle}</title>
      {!node.context?.isActive && <meta name="robots" content="noindex" />}
      <SocialMediaMetadata
        title={metaTitle}
        description={node.meta?.metaDescription}
        imageUrl={node.article?.metaImage?.url}
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
              {!!node.url && !!articleId && (
                <AddResourceToFolderModal
                  resource={{
                    id: articleId,
                    path: node.url,
                    resourceType: "topic",
                  }}
                >
                  <FavoriteButton path={node.url} />
                </AddResourceToFolderModal>
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
        {subjectType === "multiDisciplinary" && node.context?.parents?.length === 2 && !!node.children?.length ? (
          <MultidisciplinaryArticleList nodes={node.children} />
        ) : node.children?.length ? (
          <NodeGridWrapper aria-labelledby={headingId}>
            <Heading textStyle="heading.small" asChild consumeCss id={headingId}>
              <h2>{t("topicPage.topics")}</h2>
            </Heading>
            <StyledTransportationPageNodeListGrid>
              {node.children.map((node) => (
                <TransportationNode key={node.id} node={node} />
              ))}
            </StyledTransportationPageNodeListGrid>
          </NodeGridWrapper>
        ) : undefined}
        {!!node && (
          <NoSSR fallback={null}>
            <BleedPageContent>
              <PageContent variant="article">
                <Resources parentId={node.id} rootId={node.context?.rootId} headingType="h2" subHeadingType="h3" />
              </PageContent>
            </BleedPageContent>
          </NoSSR>
        )}
      </StyledPageContainer>
    </main>
  );
};

TopicContainer.fragments = {
  node: gql`
    fragment TopicContainer_Node on Node {
      id
      name
      contentUri
      url
      children(nodeType: "TOPIC") {
        id
        ...TransportationNode_Node
        ...MultidisciplinaryArticleList_Node
      }
    }
    ${TransportationNode.fragments.node}
    ${MultidisciplinaryArticleList.fragments.node}
  `,
};
