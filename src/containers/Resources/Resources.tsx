/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Heading, Spinner } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ReactNode, useId } from "react";
import { useTranslation } from "react-i18next";
import { TransportationNode } from "../../components/TransportationPage/TransportationPageNode";
import { TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES, TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE } from "../../constants";
import { GQLLaunchpadQuery, GQLLaunchpadQueryVariables } from "../../graphqlTypes";
import { partitionResources } from "./getResourceGroups";
import { ResourceItem } from "./ResourceItem";

interface Props {
  parentId: string;
  rootId?: string;
}

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const LayoutContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xxlarge",
  },
});

export const Resources = ({ parentId, rootId }: Props) => {
  const { t } = useTranslation();

  const { error, loading, data } = useQuery<GQLLaunchpadQuery, GQLLaunchpadQueryVariables>(resourcesQuery, {
    variables: {
      parentId: parentId,
      rootId: rootId,
    },
  });

  const node = data?.node;
  const resourceTypes = data?.resourceTypes;

  const { coreArticles, supplementaryArticles, learningpaths } = partitionResources(
    node?.children ?? [],
    resourceTypes ?? [],
    node?.metadata.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
  );

  if (loading) {
    return <Spinner />;
  }

  if (error || !node?.children?.length) {
    return null;
  }

  return (
    <LayoutContainer>
      {!!coreArticles.length && (
        <NavSection title={t("launchpad.coreContentTitle")} variant="listItems">
          {coreArticles.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </NavSection>
      )}
      {!!learningpaths.length && (
        <NavSection title={t("launchpad.learningpathsTitle")} variant="listItems">
          {learningpaths.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </NavSection>
      )}
      {!!node.links?.length && (
        <NavSection title={t("launchpad.linksTitle")} variant="cards">
          {node.links.map((link) => (
            <TransportationNode key={link.id} node={link} context="link" />
          ))}
        </NavSection>
      )}
      {!!supplementaryArticles.length && (
        <NavSection title={t("launchpad.supplementaryContentTitle")} variant="listItems">
          {supplementaryArticles.map((resource) => (
            <ResourceItem key={resource.id} resource={resource} />
          ))}
        </NavSection>
      )}
    </LayoutContainer>
  );
};

interface NavSectionProps {
  title: string;
  children: ReactNode;
  variant: "listItems" | "cards";
}

const StyledOl = styled("ol", {
  base: {
    display: "flex",
  },
  variants: {
    variant: {
      listItems: {
        flexDirection: "column",
        gap: "xxsmall",
      },
      cards: {
        flexWrap: "wrap",
        gap: "medium",
      },
    },
  },
});

const NavSection = ({ title, children, variant }: NavSectionProps) => {
  const headingId = useId();
  return (
    <StyledNav aria-describedby={headingId}>
      <Heading id={headingId} textStyle="title.large" asChild consumeCss>
        <h2>{title}</h2>
      </Heading>
      <StyledOl variant={variant}>{children}</StyledOl>
    </StyledNav>
  );
};

const resourcesQuery = gql`
  query launchpad($parentId: String!, $rootId: String) {
    node(id: $parentId, rootId: $rootId) {
      id
      name
      url
      children(nodeType: "RESOURCE") {
        id
        ...ResourceItem_Node
      }
      links {
        ...TransportationNode_Node
      }
      metadata {
        customFields
      }
    }
    resourceTypes {
      id
      name
    }
  }
  ${ResourceItem.fragments.node}
  ${TransportationNode.fragments.node}
`;
