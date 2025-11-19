/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import parse from "html-react-parser";
import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { extractEmbedMeta } from "@ndla/article-converter";
import { InformationLine } from "@ndla/icons";
import { Badge, Heading, MessageBox, PageContent, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { HomeBreadcrumb } from "@ndla/ui";
import { NoSSR } from "@ndla/util";
import { FavoriteButton } from "../../components/Article/FavoritesButton";
import { CompetenceGoals } from "../../components/CompetenceGoals";
import { PageContainer } from "../../components/Layout/PageContainer";
import { ImageLicenseAccordion } from "../../components/license/ImageLicenseAccordion";
import { AddResourceToFolderModal } from "../../components/MyNdla/AddResourceToFolderModal";
import { PageTitle } from "../../components/PageTitle";
import { SocialMediaMetadata } from "../../components/SocialMediaMetadata";
import { TransportationPageHeader } from "../../components/TransportationPage/TransportationPageHeader";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { TransportationPageNodeListGrid } from "../../components/TransportationPage/TransportationPageNodeListGrid";
import { TransportationPageVisualElement } from "../../components/TransportationPage/TransportationPageVisualElement";
import { RELEVANCE_SUPPLEMENTARY, SKIP_TO_CONTENT_ID } from "../../constants";
import { GQLTopicPageQuery } from "../../graphqlTypes";
import { SubjectType } from "../../routeHelpers";
import { htmlTitle } from "../../util/titleHelper";
import { getArticleIdFromResource } from "../Resources/resourceHelpers";
import { Resources } from "../Resources/Resources";

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
    background: "background.strong",
    gap: "xxlarge",
    overflowX: "hidden",
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
  const headingId = useId();
  const linksHeadingId = useId();
  const articleId = getArticleIdFromResource(node.contentUri);

  const metaTitle = useMemo(() => htmlTitle(node.name, [node.breadcrumbs[0]]), [node.breadcrumbs, node.name]);
  const pageTitle = useMemo(() => htmlTitle(metaTitle, [t("htmlTitles.titleTemplate")]), [metaTitle, t]);

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

  const mainContext = useMemo(() => {
    return subjectType === "multiDisciplinary" && node.context?.parents?.length === 2 ? "case" : "node";
  }, [node.context?.parents?.length, subjectType]);

  return (
    <main>
      <PageTitle title={pageTitle} />
      {!node.context?.isActive && <meta name="robots" content="noindex, nofollow" />}
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
              {node.relevanceId === RELEVANCE_SUPPLEMENTARY && <Badge>{t("navigation.additionalTopic")}</Badge>}
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
              <Text textStyle="body.large" asChild consumeCss>
                <div>
                  {node.article?.htmlIntroduction?.length
                    ? parse(node.article.htmlIntroduction)
                    : node.meta?.metaDescription}
                </div>
              </Text>
            )}
            {!!node.article?.grepCodes?.filter((gc) => gc.toUpperCase().startsWith("K")).length && (
              <CompetenceGoals
                codes={node.article.grepCodes}
                subjectId={node.context?.rootId}
                supportedLanguages={node.article.supportedLanguages}
              />
            )}
          </HeaderWrapper>
          <TransportationPageVisualElement embed={embedMeta} metaImage={node.article?.metaImage} />
        </TransportationPageHeader>
      </StyledTopicWrapper>
      <StyledPageContainer>
        {!!node.context && !node.context.isActive && (
          <MessageBox variant="warning">
            <InformationLine />
            {t("archivedPage")}
          </MessageBox>
        )}
        {!!node.children?.length && (
          <NodeGridWrapper aria-labelledby={headingId}>
            <Heading textStyle="heading.small" asChild consumeCss id={headingId}>
              <h2>
                {mainContext === "node"
                  ? t("topicsPage.topics")
                  : t("multidisciplinary.casesCount", { count: node.children.length })}
              </h2>
            </Heading>
            <TransportationPageNodeListGrid context={mainContext}>
              {node.children.map((node) => (
                <TransportationNode key={node.id} node={node} context={mainContext} />
              ))}
            </TransportationPageNodeListGrid>
          </NodeGridWrapper>
        )}
        {!!node.links?.length && (
          <NodeGridWrapper aria-labelledby={linksHeadingId}>
            <Heading textStyle="heading.small" asChild consumeCss id={linksHeadingId}>
              <h2>{t("topicsPage.multidisciplinaryLinksHeader")}</h2>
            </Heading>
            <TransportationPageNodeListGrid context="case">
              {node.links?.map((link) => (
                <TransportationNode key={link.id} node={link} context="link" />
              ))}
            </TransportationPageNodeListGrid>
          </NodeGridWrapper>
        )}
        {!!node && (
          <NoSSR fallback={null}>
            <Resources parentId={node.id} rootId={node.context?.rootId} />
          </NoSSR>
        )}
        {!!node.article?.transformedContent.metaData?.images && (
          <ImageLicenseAccordion imageLicenses={node.article.transformedContent.metaData.images} />
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
      links {
        ...TransportationNode_Node
      }
      children(nodeType: "TOPIC") {
        id
        ...TransportationNode_Node
      }
    }
    ${TransportationNode.fragments.node}
  `,
};
