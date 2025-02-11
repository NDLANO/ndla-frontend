/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback } from "react";
import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Heading,
} from "@ndla/primitives";
import { SearchTrait } from "@ndla/types-backend/search-api";
import { FilterContainer } from "./FilterContainer";
import { useStableSearchParams } from "../../util/useStableSearchParams";

const TRAITS: SearchTrait[] = ["VIDEO", "AUDIO", "H5P", "PODCAST"];

export const TraitFilter = () => {
  const [searchParams, setSearchParams] = useStableSearchParams();

  const onValueChange = useCallback(
    (traits: string[]) => {
      setSearchParams({ traits: traits.join(",") });
    },
    [setSearchParams],
  );

  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        {/* TODO: i18n */}
        <h3>Vis sider med</h3>
      </Heading>
      <CheckboxGroup value={searchParams.get("traits")?.split(",") ?? []} onValueChange={onValueChange}>
        {TRAITS.map((trait) => (
          <CheckboxRoot key={trait} value={trait}>
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <CheckLine />
              </CheckboxIndicator>
            </CheckboxControl>
            {/* TODO: i18n */}
            <CheckboxLabel>{trait}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
};
