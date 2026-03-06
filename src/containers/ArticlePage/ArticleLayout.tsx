/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Hero, HeroBackground } from "@ndla/primitives";
import { ReactNode, useMemo } from "react";
import { useParams } from "react-router";
import { MobileLaunchpadMenu } from "../../components/Resource/Launchpad";
import { ResourceBreadcrumb } from "../../components/Resource/ResourceBreadcrumb";
import { LayoutWrapper, ResourceContentContainer, RootPageContent } from "../../components/Resource/ResourceLayout";
import { ResourceNavigation } from "../../components/Resource/ResourceNavigation";
import { useRestrictedMode } from "../../components/RestrictedModeContext";
import { TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES, TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE } from "../../constants";
import { GQLArticleLayoutQuery, GQLArticleLayoutQueryVariables } from "../../graphqlTypes";
import { Breadcrumb } from "../../interfaces";
import { partitionResources } from "../Resources/getResourceGroups";
import { ArticleLaunchpad } from "./ArticleLaunchpad";

interface Props {
  parentId: string | undefined;
  rootId: string | undefined;
  rootLoading: boolean;
  children: ReactNode;
}

const articleLayoutQueryDef = gql`
  query articleLayout($id: String!, $rootId: String) {
    node(id: $id, rootId: $rootId) {
      id
      name
      url
      metadata {
        customFields
      }
      context {
        contextId
        parents {
          contextId
          id
          name
          url
        }
      }
      children(nodeType: "RESOURCE") {
        id
        context {
          contextId
          url
        }
        ...ArticleLaunchpad_Resource
      }
      ...ArticleLaunchpad_Node
    }
    resourceTypes {
      id
      name
    }
  }
  ${ArticleLaunchpad.fragments.resource}
  ${ArticleLaunchpad.fragments.node}
`;

type Resource = NonNullable<NonNullable<GQLArticleLayoutQuery["node"]>["children"]>[number];

const getId = (resource: Resource) => resource.context?.contextId;

const getUrl = (resource: Resource | undefined) => resource?.context?.url;

export const ArticleLayout = ({ parentId, rootId, children, rootLoading }: Props) => {
  const restrictedInfo = useRestrictedMode();
  const { contextId } = useParams();

  const topicQuery = useQuery<GQLArticleLayoutQuery, GQLArticleLayoutQueryVariables>(articleLayoutQueryDef, {
    variables: { id: parentId!, rootId },
    skip: !parentId || !rootId,
  });

  const isLoading =
    topicQuery.loading ||
    (topicQuery.dataState === "empty" && rootLoading) ||
    // If the topic doesn't contain the current contextId, we've most likely navigated outside of the current topic.
    // If the current child is a learningpath, we should display loading until this component unmounts
    !topicQuery.data?.node?.children?.find(
      (child) => child.context?.contextId === contextId && child.contentUri?.includes("article"),
    );

  const isUnordered =
    topicQuery.data?.node?.metadata.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !==
    TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE;

  const { coreArticles, supplementaryArticles, learningpaths } = partitionResources<Resource>(
    topicQuery.data?.node?.children ?? [],
    topicQuery.data?.resourceTypes ?? [],
    isUnordered,
  );

  const crumbs = useMemo(() => {
    const topic = topicQuery.data?.node;
    if (!topic) return [];
    const crumb: Breadcrumb[] = topic.context?.parents?.slice() ?? [];

    crumb.push({ name: topic.name, url: topic.url ?? "" });
    const resource = topic.children?.find((child) => child.context?.contextId && child.context.contextId === contextId);
    if (resource) {
      crumb.push({ name: resource.name, url: resource.url ?? "" });
    }
    return crumb;
  }, [contextId, topicQuery.data?.node]);

  return (
    <Hero variant="brand1Subtle">
      <HeroBackground />
      <RootPageContent variant="wide" asChild consumeCss>
        <main>
          <ResourceBreadcrumb breadcrumbs={crumbs} loading={isLoading} />
          {!restrictedInfo.restricted && (
            <MobileLaunchpadMenu>
              <ArticleLaunchpad
                context="mobile"
                topic={topicQuery.data?.node}
                learningpaths={learningpaths}
                coreArticles={coreArticles}
                supplementaryArticles={supplementaryArticles}
                isUnordered={isUnordered}
                loading={isLoading}
              />
            </MobileLaunchpadMenu>
          )}
          <LayoutWrapper>
            {!restrictedInfo.restricted && (
              <ArticleLaunchpad
                context="desktop"
                topic={topicQuery.data?.node}
                loading={isLoading}
                learningpaths={learningpaths}
                coreArticles={coreArticles}
                supplementaryArticles={supplementaryArticles}
                isUnordered={isUnordered}
              />
            )}
            <ResourceContentContainer>
              {children}
              <ResourceNavigation
                parentUrl={topicQuery.data?.node?.url}
                items={coreArticles}
                currentId={contextId}
                getUrl={getUrl}
                getId={getId}
              />
            </ResourceContentContainer>
          </LayoutWrapper>
        </main>
      </RootPageContent>
    </Hero>
  );
};
