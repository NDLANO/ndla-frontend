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
import { ArrowDownShortLine, CheckLine } from "@ndla/icons";
import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot,
  CheckboxControl,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Heading,
  IconButton,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupLabel,
  RadioGroupRoot,
  Spinner,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import { ALL_NODE_TYPES, defaultNodeType, RESOURCE_NODE_TYPE, SUBJECT_NODE_TYPE, TOPIC_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import {
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SOURCE_MATERIAL,
} from "../../constants";
import {
  GQLResourceTypeFilter_BucketResultFragment,
  GQLResourceTypeFilter_ResourceTypeDefinitionFragment,
} from "../../graphqlTypes";
import { useLtiContext } from "../../LtiContext";

const DELIMITER = "//";

interface Props {
  bucketResult: GQLResourceTypeFilter_BucketResultFragment[];
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

const TopLevelCountText = styled(Text, {
  base: {
    marginInlineEnd: "xsmall",
  },
});

const StyledAccordionRoot = styled(AccordionRoot, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledAccordionItemContent = styled(AccordionItemContent, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
    marginInlineStart: "small",
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
const visibleResourceTypes = [
  RESOURCE_TYPE_LEARNING_PATH,
  RESOURCE_TYPE_SUBJECT_MATERIAL,
  RESOURCE_TYPE_TASKS_AND_ACTIVITIES,
  RESOURCE_TYPE_ASSESSMENT_RESOURCES,
  RESOURCE_TYPE_CONCEPT,
  RESOURCE_TYPE_SOURCE_MATERIAL,
];

export const ResourceTypeFilter = ({ bucketResult, resourceTypes: resourceTypesProp, resourceTypesLoading }: Props) => {
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const { t } = useTranslation();
  const isLti = useLtiContext();

  const nodeType = useMemo(() => searchParams.get("type") ?? defaultNodeType(isLti), [isLti, searchParams]);

  const keyedBucketResult = useMemo(() => {
    return bucketResult.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.value.replace("urn:resourcetype:", "")] = curr.count;
      return acc;
    }, {});
  }, [bucketResult]);

  const resourceTypes = useMemo(() => {
    return resourceTypesProp.reduce<GQLResourceTypeFilter_ResourceTypeDefinitionFragment[]>((acc, type) => {
      if (!visibleResourceTypes.includes(type.id)) return acc;
      acc.push({
        ...type,
        id: type.id.replace("urn:resourcetype:", ""),
        subtypes: type.subtypes?.map((subtype) => ({
          ...subtype,
          id: subtype.id.replace("urn:resourcetype:", ""),
        })),
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
          const subtypes = resourceTypes.find((rt) => rt.id === parentId)?.subtypes?.map((s) => s.id) ?? [];
          const newResourceTypes = currentResourceTypeIds.filter((id) => id !== parentId && !subtypes.includes(id));
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
    [currentResourceTypeIds, resourceTypes, setSearchParams],
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
            {resourceTypes.map((resourceType) =>
              resourceType.subtypes?.length ? (
                <AccordionItem key={resourceType.id} value={resourceType.id}>
                  <FilterWrapper>
                    <CheckboxRoot
                      value={resourceType.id}
                      // Indicate that the parent type is checked if any of its subtypes are checked.
                      checked={
                        currentResourceTypeIds.includes(resourceType.id) ||
                        resourceType.subtypes.some((s) => currentResourceTypeIds.includes(s.id))
                      }
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
                    <AccordionItemTrigger asChild>
                      <IconButton
                        variant="tertiary"
                        size="small"
                        aria-label={t("searchPage.resourceTypeFilter.showSubtypes", { parent: resourceType.name })}
                        title={t("searchPage.resourceTypeFilter.showSubtypes", { parent: resourceType.name })}
                      >
                        <AccordionItemIndicator asChild>
                          <ArrowDownShortLine size="medium" />
                        </AccordionItemIndicator>
                      </IconButton>
                    </AccordionItemTrigger>
                  </FilterWrapper>
                  <StyledAccordionItemContent>
                    {resourceType.subtypes.map((subtype) => (
                      <FilterWrapper key={subtype.id}>
                        <CheckboxRoot
                          value={subtype.id}
                          checked={currentResourceTypeIds.includes(subtype.id)}
                          onCheckedChange={(details) =>
                            onToggleResourceType(
                              `${resourceType.id}${DELIMITER}${subtype.id}`,
                              details.checked === true,
                            )
                          }
                        >
                          <CheckboxControl>
                            <CheckboxIndicator asChild>
                              <CheckLine />
                            </CheckboxIndicator>
                          </CheckboxControl>
                          <CheckboxLabel>{subtype.name}</CheckboxLabel>
                          <CheckboxHiddenInput />
                        </CheckboxRoot>
                        {keyedBucketResult[subtype.id] != null && (
                          <Text
                            asChild
                            consumeCss
                            color="text.subtle"
                            textStyle="label.medium"
                            aria-label={t("searchPage.resourceTypeFilter.hits", {
                              count: keyedBucketResult[subtype.id],
                            })}
                          >
                            <span>{keyedBucketResult[subtype.id]}</span>
                          </Text>
                        )}
                      </FilterWrapper>
                    ))}
                  </StyledAccordionItemContent>
                </AccordionItem>
              ) : (
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
                  {keyedBucketResult[resourceType.id] != null && (
                    <TopLevelCountText asChild consumeCss color="text.subtle" textStyle="label.medium">
                      <span>{keyedBucketResult[resourceType.id]}</span>
                    </TopLevelCountText>
                  )}
                </FilterWrapper>
              ),
            )}
          </StyledAccordionRoot>
        )}
      </CheckboxWrapper>
    </FilterContainer>
  );
};

ResourceTypeFilter.fragments = {
  bucketResult: gql`
    fragment ResourceTypeFilter_BucketResult on BucketResult {
      value
      count
    }
  `,
  resourceTypeDefinition: gql`
    fragment ResourceTypeFilter_ResourceTypeDefinition on ResourceTypeDefinition {
      id
      name
      subtypes {
        id
        name
      }
    }
  `,
};
