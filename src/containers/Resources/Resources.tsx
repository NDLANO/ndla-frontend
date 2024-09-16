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
import { PageSpinner } from "../../components/PageSpinner";
import { StableId } from "../../components/StableId";
import { TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES, TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE } from "../../constants";
import {
  GQLResources_ResourceTypeDefinitionFragment,
  GQLResources_TopicFragment,
  GQLResourcesQueryQuery,
} from "../../graphqlTypes";
import { HeadingType } from "../../interfaces";
import { contentTypeMapping } from "../../util/getContentType";
import { useGraphQuery } from "../../util/runQueries";

interface Props {
  topicId?: string;
  subjectId?: string;
  resourceId?: string;
  topic?: GQLResources_TopicFragment;
  resourceTypes?: GQLResources_ResourceTypeDefinitionFragment[];
  headingType: HeadingType;
  subHeadingType: HeadingType;
  currentResourceContentType?: ContentType;
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
    alignItems: "center",
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

const Resources = ({
  topicId,
  subjectId,
  resourceId,
  topic: maybeTopic,
  resourceTypes,
  headingType: HeadingType,
  subHeadingType: SubHeadingType,
  currentResourceContentType,
}: Props) => {
  const { resourceId } = useUrnIds();
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const { t } = useTranslation();
  const navHeadingId = useId();

  const { error, loading, data } = useGraphQuery<GQLResourcesQueryQuery>(resourcesQuery, {
    skip: maybeTopic !== undefined || (!topicId && !subjectId),
    variables: {
      topicId: topicId,
      subjectId: subjectId,
    },
  });

  const topic = maybeTopic ?? data?.topic;

  const { supplementaryResources, sortedResources } = useMemo(
    () => getResourceGroupings(topic?.children ?? [], resourceId),
    [resourceId, topic?.children],
  );

  const isGrouped = useMemo(
    () =>
      topic?.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
    [topic?.metadata?.customFields],
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
    const showAdditional = window.localStorage.getItem("showAdditionalResources");
    setShowAdditionalResources(showAdditional === "true");
  }, []);

  const toggleAdditionalResources = useCallback(() => {
    setShowAdditionalResources((prev) => {
      window?.localStorage.setItem("showAdditionalResources", `${!prev}`);
      return !prev;
    });
  }, []);

  if (loading) {
    return <PageSpinner />;
  }

  if (error) {
    return null;
  }

  if (!sortedResources.length) {
    return null;
  }

  return (
    <StyledNav aria-labelledby={navHeadingId}>
      <TitleWrapper>
        <StyledHGroup>
          <Heading id={navHeadingId} textStyle="title.large" asChild consumeCss>
            <HeadingType>{t("resource.label")}</HeadingType>
          </Heading>
          <Text textStyle="label.medium">{topic?.name}</Text>
        </StyledHGroup>
        {!!supplementaryResources.length && (
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

const resourceFragment = gql`
  fragment Resources_Resource on Node {
    id
    name
    contentUri
    path
    url
    rank
    language
    relevanceId
    context {
      contextId
      breadcrumbs
      name
      path
      url
      rootId
    }
    article {
      metaImage {
        url
        alt
      }
    }
    learningpath {
      coverphoto {
        url
      }
    }
    resourceTypes {
      id
      name
    }
  }
`;

Resources.fragments = {
  resourceType: gql`
    fragment Resources_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
    }
  `,
  topic: gql`
    fragment Resources_Topic on Node {
      id
      name
      path
      url
      children(nodeType: "RESOURCE") {
        ...Resources_Resource
      }
      metadata {
        customFields
      }
    }
    ${resourceFragment}
  `,
};

const resourcesQuery = gql`
  query resourcesQuery($topicId: String!, $subjectId: String!) {
    topic: node(id: $topicId, rootId: $subjectId) {
      ...Resources_Topic
    }
  }
  ${Resources.fragments.topic}
`;

export default Resources;
