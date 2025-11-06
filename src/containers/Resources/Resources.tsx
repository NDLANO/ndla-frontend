/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
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
import { sortResources } from "./getResourceGroups";
import { ResourceItem } from "./ResourceItem";
import {
  RELEVANCE_SUPPLEMENTARY,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from "../../constants";
import { GQLLaunchpadQuery, GQLLaunchpadQueryVariables } from "../../graphqlTypes";
import { useLocalStorage } from "../../util/useLocalStorage";

interface Props {
  currentResourceId?: string;
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

const StyledSwitchRoot = styled(SwitchRoot, {
  base: {
    marginInlineStart: "auto",
  },
});

const SpinnerWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const StyledResourceList = styled("ol", {
  base: {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "xxsmall",
  },
});

export const Resources = ({ parentId, rootId, currentResourceId }: Props) => {
  const [showAdditionalResources, setShowAdditionalResources] = useLocalStorage("showAdditionalResources", "false");
  const { t } = useTranslation();
  const navHeadingId = useId();

  const { error, loading, data } = useQuery<GQLLaunchpadQuery, GQLLaunchpadQueryVariables>(resourcesQuery, {
    variables: {
      parentId: parentId,
      rootId: rootId,
    },
  });

  const node = data?.node;

  const sortedResources = useMemo(
    () =>
      sortResources(
        node?.children ?? [],
        node?.metadata.customFields[TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES] !== TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
      ),
    [node?.children, node?.metadata.customFields],
  );

  const supplementaryResourcesCount = useMemo(
    () => node?.children?.filter((r) => r.relevanceId === RELEVANCE_SUPPLEMENTARY).length ?? 0,
    [node],
  );

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
            <h2>{t("resource.label")}</h2>
          </Heading>
          <Text textStyle="label.medium">{node?.name}</Text>
        </StyledHGroup>
        {!!supplementaryResourcesCount && (
          <StyledSwitchRoot
            checked={showAdditionalResources === "true"}
            onCheckedChange={(details) => setShowAdditionalResources(details.checked.toString())}
          >
            <SwitchLabel>{t("resource.activateAdditionalResources")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </StyledSwitchRoot>
        )}
      </TitleWrapper>
      <div>
        <StyledResourceList>
          {sortedResources.map((resource) => (
            <ResourceItem
              key={resource.id}
              resource={resource}
              active={currentResourceId === resource.id}
              showAdditionalResources={showAdditionalResources === "true"}
              contentType={resource.contentType}
            />
          ))}
        </StyledResourceList>
        {!!(
          !showAdditionalResources &&
          supplementaryResourcesCount &&
          supplementaryResourcesCount === node?.children?.length
        ) && <Text>{t("resource.noCoreResourcesAvailableUnspecific")}</Text>}
      </div>
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
      metadata {
        customFields
      }
    }
  }
  ${ResourceItem.fragments.node}
`;
