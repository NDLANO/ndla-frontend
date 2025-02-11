/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
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
import { GQLResourceTypeFilter_BucketResultFragment, GQLSearchResourceTypesQuery } from "../../graphqlTypes";

interface Props {
  bucketResult: GQLResourceTypeFilter_BucketResultFragment[];
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

const searchResourceTypesQuery = gql`
  query searchResourceTypes {
    resourceTypes {
      id
      name
      subtypes {
        id
        name
      }
    }
  }
`;

export const ResourceTypeFilter = ({ bucketResult }: Props) => {
  const resourceTypesQuery = useQuery<GQLSearchResourceTypesQuery>(searchResourceTypesQuery);

  const keyedBucketResult = useMemo(() => {
    return bucketResult.reduce<Record<string, number>>((acc, curr) => {
      acc[curr.value] = curr.count;
      return acc;
    }, {});
  }, [bucketResult]);

  console.log(keyedBucketResult);

  console.log(resourceTypesQuery.data);

  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        {/* TODO: i18n */}
        <h3>Velg sidetype</h3>
      </Heading>
      {resourceTypesQuery.loading ? (
        <Spinner />
      ) : (
        <StyledAccordionRoot variant="clean" multiple>
          {resourceTypesQuery.data?.resourceTypes?.map((resourceType) =>
            resourceType.subtypes?.length ? (
              <AccordionItem key={resourceType.id} value={resourceType.id}>
                <FilterWrapper>
                  <CheckboxRoot value={resourceType.id}>
                    <CheckboxControl>
                      <CheckboxIndicator asChild>
                        <CheckLine />
                      </CheckboxIndicator>
                    </CheckboxControl>
                    <CheckboxLabel>{resourceType.name}</CheckboxLabel>
                    <CheckboxHiddenInput />
                  </CheckboxRoot>
                  <AccordionItemTrigger asChild>
                    {/* TODO: i18n */}
                    <IconButton variant="tertiary" size="small" aria-label="Åpne" title="Åpne">
                      <AccordionItemIndicator asChild>
                        <ArrowDownShortLine size="medium" />
                      </AccordionItemIndicator>
                    </IconButton>
                  </AccordionItemTrigger>
                </FilterWrapper>
                <StyledAccordionItemContent>
                  {resourceType.subtypes.map((subtype) => (
                    <FilterWrapper key={subtype.id}>
                      <CheckboxRoot value={subtype.id}>
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
                <CheckboxRoot value={resourceType.id}>
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
};
