/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import {
  Heading,
  Spinner,
  SwitchControl,
  SwitchHiddenInput,
  SwitchLabel,
  SwitchRoot,
  SwitchThumb,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { ContentType } from "@ndla/ui";
import { getResourceGroupings, getResourceGroups, sortResourceTypes } from "./getResourceGroups";
import ResourceList from "./ResourceList";
import { StableId } from "../../components/StableId";
import {
  RELEVANCE_SUPPLEMENTARY,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from "../../constants";
import { GQLResourcesQueryQuery } from "../../graphqlTypes";
import { HeadingType } from "../../interfaces";
import { contentTypeMapping } from "../../util/getContentType";
import { useGraphQuery } from "../../util/runQueries";

interface Props {
  headingType: HeadingType;
  subHeadingType: HeadingType;
  currentResourceContentType?: ContentType;
  currentResourceId?: string;
  parentId?: string;
  rootId?: string;
}

const StyledNav = styled("nav", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const TitleWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    paddingBlockEnd: "3xsmall",
  },
});

const StyledHGroup = styled("hgroup", {
  base: {
    display: "flex",
    gap: "xsmall",
    flexWrap: "wrap",
    alignItems: "baseline",
  },
});

const ListWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledForm = styled("form", {
  base: {
    marginInlineStart: "auto",
  },
});

const ResourceContainer = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

const SpinnerWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Resources = ({
  parentId,
  rootId,
  headingType: HeadingType,
  subHeadingType: SubHeadingType,
  currentResourceContentType,
  currentResourceId,
}: Props) => {
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const { t } = useTranslation();
  const navHeadingId = useId();

  const { error, loading, data } = useGraphQuery<GQLResourcesQueryQuery>(resourcesQuery, {
    variables: {
      parentId: parentId,
      rootId: rootId,
    },
  });

  const node = data?.node;
  const resourceTypes = data?.resourceTypes;

  const { sortedResources } = useMemo(
    () => getResourceGroupings(node?.children ?? [], currentResourceId),
    [currentResourceId, node?.children],
  );

  const isGrouped = useMemo(
    () =>
      node?.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
    [node?.metadata?.customFields],
  );

  const { groupedResources, ungroupedResources } = useMemo(() => {
    if (isGrouped) {
      const resourceGroups = getResourceGroups(resourceTypes ?? [], sortedResources);
      const groupedResources = resourceGroups.map((type) => ({ ...type, contentType: contentTypeMapping[type.id] }));
      return { groupedResources, ungroupedResources: [] };
    }

    const ungroupedResources = sortedResources.map((res) => {
      const firstResourceType = sortResourceTypes(res.resourceTypes ?? [])?.[0];
      return { ...res, contentType: firstResourceType ? contentTypeMapping[firstResourceType.id] : undefined };
    });
    return { groupedResources: [], ungroupedResources };
  }, [isGrouped, resourceTypes, sortedResources]);

  useEffect(() => {
    const showAdditional = window.localStorage?.getItem("showAdditionalResources");
    setShowAdditionalResources(showAdditional === "true");
  }, []);

  const toggleAdditionalResources = useCallback(() => {
    setShowAdditionalResources((prev) => {
      window?.localStorage?.setItem("showAdditionalResources", `${!prev}`);
      return !prev;
    });
  }, []);

  const hasSupplementaryResources = useMemo(() => {
    return node?.children?.some((resource) => resource.relevanceId === RELEVANCE_SUPPLEMENTARY);
  }, [node?.children]);

  if (loading) {
    return (
      <SpinnerWrapper>
        <Spinner />
      </SpinnerWrapper>
    );
  }

  if (error || !sortedResources.length) {
    return null;
  }

  return (
    <StyledNav aria-labelledby={navHeadingId}>
      <TitleWrapper>
        <StyledHGroup>
          <Heading id={navHeadingId} textStyle="title.large" asChild consumeCss>
            <HeadingType>{t("resource.label")}</HeadingType>
          </Heading>
          <Text textStyle="label.medium">{node?.name}</Text>
        </StyledHGroup>
        {!!hasSupplementaryResources && (
          <StyledForm>
            <SwitchRoot checked={showAdditionalResources} onCheckedChange={toggleAdditionalResources}>
              <SwitchLabel>{t("resource.activateAdditionalResources")}</SwitchLabel>
              <SwitchControl>
                <SwitchThumb />
              </SwitchControl>
              <SwitchHiddenInput />
            </SwitchRoot>
          </StyledForm>
        )}
      </TitleWrapper>
      <ResourceContainer>
        {!isGrouped ? (
          <ResourceList
            resources={ungroupedResources}
            showAdditionalResources={showAdditionalResources}
            currentResourceContentType={currentResourceContentType}
            currentResourceId={currentResourceId}
          />
        ) : (
          groupedResources.map((type) => (
            <StableId key={type.id}>
              {(id) => (
                <ListWrapper>
                  <Heading id={id} textStyle="title.medium" asChild consumeCss>
                    <SubHeadingType>{type.name}</SubHeadingType>
                  </Heading>
                  <ResourceList
                    headingId={id}
                    title={type.name}
                    showAdditionalResources={showAdditionalResources}
                    contentType={type.contentType}
                    resources={type.resources ?? []}
                    currentResourceContentType={currentResourceContentType}
                    currentResourceId={currentResourceId}
                  />
                </ListWrapper>
              )}
            </StableId>
          ))
        )}
      </ResourceContainer>
    </StyledNav>
  );
};

Resources.fragments = {
  resourceType: gql`
    fragment Resources_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
    }
  `,
  node: gql`
    fragment Resources_Parent on Node {
      id
      name
      url
      children(nodeType: "RESOURCE") {
        id
        name
        url
        rank
        language
        relevanceId
        article {
          id
          metaImage {
            url
            alt
          }
        }
        learningpath {
          id
          coverphoto {
            url
          }
        }
        resourceTypes {
          id
          name
        }
      }
      metadata {
        customFields
      }
    }
  `,
};

const resourcesQuery = gql`
  query resourcesQuery($parentId: String!, $rootId: String!) {
    node(id: $parentId, rootId: $rootId) {
      ...Resources_Parent
    }
    resourceTypes {
      ...Resources_ResourceTypeDefinition
    }
  }
  ${Resources.fragments.node}
  ${Resources.fragments.resourceType}
`;

export default Resources;
