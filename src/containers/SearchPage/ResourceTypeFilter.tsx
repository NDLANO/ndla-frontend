/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { gql } from "@apollo/client";
import { CheckLine } from "@ndla/icons";
import {
  AccordionRoot,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Heading,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Spinner,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import { ALL_NODE_TYPES, defaultNodeType, RESOURCE_NODE_TYPE, SUBJECT_NODE_TYPE, TOPIC_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import {
  NDLAFILM_RESOURCE_TYPE_DOCUMENTARY,
  NDLAFILM_RESOURCE_TYPE_FEATURE_FILM,
  NDLAFILM_RESOURCE_TYPE_SERIES,
  NDLAFILM_RESOURCE_TYPE_SHORT_FILM,
} from "../../constants";
import { GQLResourceTypeFilter_ResourceTypeDefinitionFragment } from "../../graphqlTypes";
import { useLtiContext } from "../../LtiContext";

const DELIMITER = "//";

interface Props {
  resourceTypes: GQLResourceTypeFilter_ResourceTypeDefinitionFragment[];
  resourceTypesLoading: boolean;
}

const FilterWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    gap: "xsmall",
    alignItems: "center",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledRadioGroupRoot = styled(RadioGroupRoot, {
  base: {
    _horizontal: {
      flexDirection: "column",
    },
  },
});

const CheckboxWrapper = styled("div", {
  base: {
    marginBlockStart: "xsmall",
  },
  variants: {
    lti: {
      false: {
        marginInlineStart: "large",
      },
    },
  },
});

const NODE_TYPES = [ALL_NODE_TYPES, SUBJECT_NODE_TYPE, TOPIC_NODE_TYPE, RESOURCE_NODE_TYPE];
const hiddenResourceTypes = [
  NDLAFILM_RESOURCE_TYPE_DOCUMENTARY,
  NDLAFILM_RESOURCE_TYPE_FEATURE_FILM,
  NDLAFILM_RESOURCE_TYPE_SERIES,
  NDLAFILM_RESOURCE_TYPE_SHORT_FILM,
];

export const ResourceTypeFilter = ({ resourceTypes: resourceTypesProp, resourceTypesLoading }: Props) => {
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const { t } = useTranslation();
  const isLti = useLtiContext();

  const nodeType = useMemo(() => searchParams.get("type") ?? defaultNodeType(isLti), [isLti, searchParams]);

  const resourceTypes = useMemo(() => {
    return resourceTypesProp.reduce<GQLResourceTypeFilter_ResourceTypeDefinitionFragment[]>((acc, type) => {
      if (hiddenResourceTypes.includes(type.id)) return acc;
      acc.push({
        ...type,
        id: type.id.replace("urn:resourcetype:", ""),
      });
      return acc;
    }, []);
  }, [resourceTypesProp]);

  const currentResourceTypeIds = useMemo(() => searchParams.get("resourceTypes")?.split(",") ?? [], [searchParams]);

  const onToggleResourceType = useCallback(
    (id: string, checked: boolean) => {
      const [parentId, subtypeId] = id.split(DELIMITER);
      if (!subtypeId && parentId) {
        if (checked) {
          setSearchParams({ resourceTypes: currentResourceTypeIds.concat(parentId).join(",") });
        } else {
          // If a parent type is unchecked, we also remove all subtypes of that type.
          const newResourceTypes = currentResourceTypeIds.filter((id) => id !== parentId);
          setSearchParams({ resourceTypes: newResourceTypes.join(",") });
        }
      } else if (subtypeId && parentId) {
        if (checked) {
          let newResourceTypeIds = currentResourceTypeIds.concat(subtypeId);
          // If the parent type is already checked, we can remove it. We only need to keep the subtype.
          if (currentResourceTypeIds.includes(parentId)) {
            newResourceTypeIds = newResourceTypeIds.filter((id) => id !== parentId);
          }
          setSearchParams({ resourceTypes: newResourceTypeIds.join(",") });
        } else {
          setSearchParams({ resourceTypes: currentResourceTypeIds.filter((s) => s !== subtypeId).join(",") });
        }
      }
    },
    [currentResourceTypeIds, setSearchParams],
  );

  const onChangeNodeType = useCallback(
    (id: string) => {
      // this will only ever happen in non-lti mode, so we don't need to check for default node type
      setSearchParams({ resourceTypes: null, type: id === ALL_NODE_TYPES ? null : id });
    },
    [setSearchParams],
  );

  return (
    <FilterContainer>
      {!!isLti && (
        <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
          <h3>{t("searchPage.resourceTypeFilter.title")}</h3>
        </Heading>
      )}
      {!isLti && (
        <StyledRadioGroupRoot
          orientation="horizontal"
          value={nodeType}
          onValueChange={(details) => (details.value ? onChangeNodeType(details.value) : undefined)}
        >
          <RadioGroupLabel textStyle="label.medium" fontWeight="bold" asChild consumeCss>
            <h3>{t("searchPage.resourceTypeFilter.title")}</h3>
          </RadioGroupLabel>
          {NODE_TYPES.map((type) => (
            <RadioGroupItem key={type} value={type}>
              <RadioGroupItemControl />
              <RadioGroupItemText>{t(`searchPage.resourceTypeFilter.${type}Label`)}</RadioGroupItemText>
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
          ))}
        </StyledRadioGroupRoot>
      )}
      <CheckboxWrapper hidden={nodeType !== RESOURCE_NODE_TYPE} lti={isLti}>
        {resourceTypesLoading ? (
          <Spinner />
        ) : (
          <StyledAccordionRoot variant="clean" multiple>
            {resourceTypes.map((resourceType) => (
              <FilterWrapper key={resourceType.id} data-testid={resourceType.id}>
                <CheckboxRoot
                  value={resourceType.id}
                  checked={currentResourceTypeIds.includes(resourceType.id)}
                  onCheckedChange={(details) => onToggleResourceType(resourceType.id, details.checked === true)}
                >
                  <CheckboxControl>
                    <CheckboxIndicator asChild>
                      <CheckLine />
                    </CheckboxIndicator>
                  </CheckboxControl>
                  <CheckboxLabel>{resourceType.name}</CheckboxLabel>
                  <CheckboxHiddenInput />
                </CheckboxRoot>
              </FilterWrapper>
            ))}
          </StyledAccordionRoot>
        )}
      </CheckboxWrapper>
    </FilterContainer>
  );
};

ResourceTypeFilter.fragments = {
  resourceTypeDefinition: gql`
    fragment ResourceTypeFilter_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
    }
  `,
};
