/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import sortBy from "lodash/sortBy";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import styled from "@emotion/styled";
import { colors, spacing } from "@ndla/core";
import { Heading } from "@ndla/typography";
import { getResourceGroups, sortResourceTypes } from "./getResourceGroups";
import ResourceList from "./ResourceList";
import ResourcesTopicTitle from "./ResourcesTopicTitle";
import FavoriteButton from "../../components/Article/FavoritesButton";
import { ResourceAttributes } from "../../components/MyNdla/AddResourceToFolder";
import AddResourceToFolderModal from "../../components/MyNdla/AddResourceToFolderModal";
import { StableId } from "../../components/StableId";
import { TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES, TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE } from "../../constants";
import {
  GQLResources_ResourceFragment,
  GQLResources_ResourceTypeDefinitionFragment,
  GQLResources_TopicFragment,
} from "../../graphqlTypes";
import { HeadingType } from "../../interfaces";
import { useIsNdlaFilm, useUrnIds } from "../../routeHelpers";
import { contentTypeMapping } from "../../util/getContentType";

interface Props {
  topic: GQLResources_TopicFragment;
  resourceTypes?: GQLResources_ResourceTypeDefinitionFragment[];
  headingType: HeadingType;
  subHeadingType: HeadingType;
}

const StyledHeading = styled(Heading)`
  &[data-inverted="true"] {
    color: ${colors.white};
  }
`;

const StyledNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${spacing.xxsmall};
  margin-bottom: ${spacing.mediumlarge};
`;

const StyledSection = styled.section`
  padding-top: ${spacing.normal};
  padding-bottom: ${spacing.normal};
`;

const Resources = ({ topic, resourceTypes, headingType, subHeadingType }: Props) => {
  const { resourceId } = useUrnIds();
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const ndlaFilm = useIsNdlaFilm();
  const { t } = useTranslation();

  const resourcesTopicId = useId();

  const isGrouped = useMemo(
    () =>
      topic?.metadata?.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
    [topic?.metadata?.customFields],
  );

  const { coreResources, supplementaryResources, sortedResources } = useMemo(() => {
    const core = topic.coreResources ?? [];
    const supp = (topic.supplementaryResources ?? [])
      .map((r) => ({ ...r, additional: true }))
      .filter((r) => !topic.coreResources?.find((c) => c.id === r.id));

    return {
      coreResources: core,
      supplementaryResources: supp,
      sortedResources: sortBy(core.concat(supp), (res) => res.rank),
    };
  }, [topic.coreResources, topic.supplementaryResources]);

  const { groupedResources, ungroupedResources } = useMemo(() => {
    if (isGrouped) {
      const resourceGroups = getResourceGroups(resourceTypes ?? [], supplementaryResources, coreResources);

      const groupedResources = resourceGroups
        .map((type) => ({
          ...type,
          resources: type?.resources?.map((res) => ({
            ...res,
            active: !!resourceId && res.id.endsWith(resourceId),
          })),
          contentType: contentTypeMapping[type.id],
        }))
        .filter((type) => type.resources?.length);
      return { groupedResources, ungroupedResources: [] };
    }

    const ungroupedResources = sortedResources.map((res) => {
      const resourceTypes = sortResourceTypes(res.resourceTypes ?? []);
      const firstResourceType = resourceTypes?.[0];
      return {
        ...res,
        active: !!resourceId && res.id.endsWith(resourceId),
        contentTypeName: firstResourceType?.name,
        contentType: firstResourceType ? contentTypeMapping[firstResourceType.id] : undefined,
      };
    });
    return { groupedResources: [], ungroupedResources };
  }, [coreResources, isGrouped, resourceId, resourceTypes, sortedResources, supplementaryResources]);

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

  if (!sortedResources.length) {
    return null;
  }

  return (
    <StyledSection>
      <ResourcesTopicTitle
        headingId={resourcesTopicId}
        heading={headingType}
        title={t("resource.label")}
        subTitle={topic.name}
        toggleAdditionalResources={toggleAdditionalResources}
        showAdditionalResources={showAdditionalResources}
        hasAdditionalResources={supplementaryResources.length > 0}
        invertedStyle={ndlaFilm}
      />
      {!isGrouped ? (
        <StyledNav aria-labelledby={resourcesTopicId}>
          <ResourceList
            resources={ungroupedResources}
            showAdditionalResources={showAdditionalResources}
            heartButton={(p) => <AddResource resources={ungroupedResources} path={p} />}
          />
        </StyledNav>
      ) : (
        groupedResources.map((type) => (
          <StableId key={type.id}>
            {(id) => (
              <StyledNav key={type.id} aria-labelledby={id}>
                <StyledHeading
                  id={id}
                  margin="none"
                  element={subHeadingType}
                  headingStyle="list-title"
                  data-inverted={ndlaFilm}
                >
                  {type.name}
                </StyledHeading>
                <ResourceList
                  title={type.name}
                  showAdditionalResources={showAdditionalResources}
                  contentType={type.contentType}
                  resources={type.resources ?? []}
                  heartButton={(p) => <AddResource resources={type.resources ?? []} path={p} />}
                />
              </StyledNav>
            )}
          </StableId>
        ))
      )}
    </StyledSection>
  );
};

interface AddResourceProps {
  resources: GQLResources_ResourceFragment[];
  path: string;
}

const AddResource = ({ resources, path }: AddResourceProps) => {
  const resource: ResourceAttributes | undefined = useMemo(() => {
    const res = resources?.find((r) => r.path === path);
    const [, resourceType, articleIdString] = res?.contentUri?.split(":") ?? [];
    const articleId = articleIdString ? parseInt(articleIdString) : undefined;
    if (!resourceType || !articleId || !path) return undefined;

    return {
      id: articleId?.toString(),
      path: path,
      resourceType,
    };
  }, [path, resources]);

  if (!resource) return null;

  return (
    <AddResourceToFolderModal resource={resource}>
      <FavoriteButton path={path} />
    </AddResourceToFolderModal>
  );
};

const resourceFragment = gql`
  fragment Resources_Resource on Resource {
    id
    name
    contentUri
    path
    paths
    rank
    language
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
    fragment Resources_Topic on Topic {
      name
      coreResources(subjectId: $subjectId) {
        ...Resources_Resource
      }
      supplementaryResources(subjectId: $subjectId) {
        ...Resources_Resource
      }
      metadata {
        customFields
      }
    }
    ${resourceFragment}
  `,
};

export default Resources;
