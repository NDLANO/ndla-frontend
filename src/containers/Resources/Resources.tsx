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
import { ResourceList } from "./ResourceList";
import {
  RELEVANCE_SUPPLEMENTARY,
  TAXONOMY_CUSTOM_FIELD_TOPIC_RESOURCES,
  TAXONOMY_CUSTOM_FIELD_UNGROUPED_RESOURCE,
} from "../../constants";
import { GQLResourcesQueryQuery } from "../../graphqlTypes";

interface Props {
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

export const Resources = ({ parentId, rootId, currentResourceId }: Props) => {
  const [showAdditionalResources, setShowAdditionalResources] = useState(false);
  const { t } = useTranslation();
  const navHeadingId = useId();

  const { error, loading, data } = useQuery<GQLResourcesQueryQuery>(resourcesQuery, {
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
            <h2>{t("resource.label")}</h2>
          </Heading>
          <Text textStyle="label.medium">{node?.name}</Text>
        </StyledHGroup>
        {!!hasSupplementaryResources && (
          <StyledSwitchRoot checked={showAdditionalResources} onCheckedChange={toggleAdditionalResources}>
            <SwitchLabel>{t("resource.activateAdditionalResources")}</SwitchLabel>
            <SwitchControl>
              <SwitchThumb />
            </SwitchControl>
            <SwitchHiddenInput />
          </StyledSwitchRoot>
        )}
      </TitleWrapper>
      <ResourceList
        headingId={navHeadingId}
        resources={sortedResources}
        showAdditionalResources={showAdditionalResources}
        currentResourceId={currentResourceId}
      />
    </StyledNav>
  );
};

const resourcesQuery = gql`
  query resourcesQuery($parentId: String!, $rootId: String!) {
    node(id: $parentId, rootId: $rootId) {
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
          traits
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
  }
`;
