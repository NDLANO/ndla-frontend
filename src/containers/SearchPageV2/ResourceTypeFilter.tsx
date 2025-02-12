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
  Spinner,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { FilterContainer } from "./FilterContainer";
import {
  GQLResourceTypeDefinition,
  GQLResourceTypeFilter_BucketResultFragment,
  GQLResourceTypeFilter_ResourceTypeDefinitionFragment,
} from "../../graphqlTypes";
import { useStableSearchParams } from "../../util/useStableSearchParams";

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
  },
});

export const ResourceTypeFilter = ({ bucketResult, resourceTypes: resourceTypesProp, resourceTypesLoading }: Props) => {
  const [searchParams, setSearchParams] = useStableSearchParams();
  const { t } = useTranslation();

  const keyedBucketResult = useMemo(() => {
    return bucketResult.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.value.replace("urn:resourcetype:", "")] = curr.count;
      return acc;
    }, {});
  }, [bucketResult]);

  const resourceTypes = useMemo(() => {
    const types = resourceTypesProp;
    const topicArticleType: GQLResourceTypeDefinition = {
      id: "topic-article",
      name: t("contentTypes.topic-article"),
    };
    return [topicArticleType].concat(types).map((type) => ({
      ...type,
      id: type.id.replace("urn:resourcetype:", ""),
      subtypes: type.subtypes?.map((subtype) => ({
        ...subtype,
        id: subtype.id.replace("urn:resourcetype:", ""),
      })),
    }));
  }, [resourceTypesProp, t]);

  const currentResourceTypeIds = useMemo(() => searchParams.get("resourceTypes")?.split(",") ?? [], [searchParams]);

  const onToggleResourceType = useCallback(
    (id: string, checked: boolean) => {
      const [parentId, subtypeId] = id.split(DELIMITER);
      if (!subtypeId && parentId) {
        if (checked) {
          setSearchParams({ resourceTypes: currentResourceTypeIds.concat(parentId).join(",") });
        } else {
          const subtypes = resourceTypes.find((rt) => rt.id === parentId)?.subtypes?.map((s) => s.id) ?? [];
          const newResourceTypes = currentResourceTypeIds.filter((id) => id !== parentId && !subtypes.includes(id));
          setSearchParams({ resourceTypes: newResourceTypes.join(",") });
        }
      } else if (subtypeId && parentId) {
        if (checked) {
          let newResourceTypeIds = currentResourceTypeIds.concat(subtypeId);
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

  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        <h3>{t("searchPage.resourceTypeFilter.title")}</h3>
      </Heading>
      {resourceTypesLoading ? (
        <Spinner />
      ) : (
        <StyledAccordionRoot variant="clean" multiple>
          {resourceTypes?.map((resourceType) =>
            resourceType.subtypes?.length ? (
              <AccordionItem key={resourceType.id} value={resourceType.id}>
                <FilterWrapper>
                  <CheckboxRoot
                    value={resourceType.id}
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
                          onToggleResourceType(`${resourceType.id}${DELIMITER}${subtype.id}`, details.checked === true)
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
                        <Text asChild consumeCss color="text.subtle" textStyle="label.medium">
                          <span>{keyedBucketResult[subtype.id]}</span>
                        </Text>
                      )}
                    </FilterWrapper>
                  ))}
                </StyledAccordionItemContent>
              </AccordionItem>
            ) : (
              <FilterWrapper key={resourceType.id}>
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
