/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Heading } from "@ndla/primitives";
import { FilterContainer } from "./FilterContainer";
import { gql } from "@apollo/client";
import { GQLResourceTypeFilter_ResourceTypeDefinitionFragment } from "../../graphqlTypes";

interface Props {
  resourceTypes: GQLResourceTypeFilter_ResourceTypeDefinitionFragment[];
}

export const ResourceTypeFilter = ({ resourceTypes }: Props) => {
  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        {/* TODO: i18n */}
        <h3>Velg sidetype</h3>
      </Heading>
    </FilterContainer>
  );
};

ResourceTypeFilter.fragments = {
  resourceType: gql`
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
