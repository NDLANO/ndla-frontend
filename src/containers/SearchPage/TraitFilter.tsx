/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
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
import { RESOURCE_NODE_TYPE } from "./searchUtils";
import { useStableSearchPageParams } from "./useStableSearchPageParams";
import { useLtiContext } from "../../LtiContext";

const TRAITS: SearchTrait[] = ["VIDEO", "AUDIO", "INTERACTIVE", "PODCAST"];

export const TraitFilter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useStableSearchPageParams();
  const nodeType = searchParams.get("type");
  const isLti = useLtiContext();
  const validNodeTypes: (string | null)[] = useMemo(() => (isLti ? [null] : [RESOURCE_NODE_TYPE]), [isLti]);

  useEffect(() => {
    if (!validNodeTypes.includes(nodeType) && searchParams.get("traits")) {
      setSearchParams({ traits: null });
    }
  }, [isLti, nodeType, searchParams, setSearchParams, validNodeTypes]);

  const onValueChange = useCallback(
    (traits: string[]) => {
      setSearchParams({ traits: traits.join(",") });
    },
    [setSearchParams],
  );

  if (!validNodeTypes.includes(nodeType)) {
    return;
  }

  return (
    <FilterContainer>
      <Heading textStyle="label.medium" fontWeight="bold" asChild consumeCss>
        <h3>{t("searchPage.traitFilter.heading")}</h3>
      </Heading>
      <CheckboxGroup value={searchParams.get("traits")?.split(",") ?? []} onValueChange={onValueChange}>
        {TRAITS.map((trait) => (
          <CheckboxRoot key={trait} value={trait}>
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <CheckLine />
              </CheckboxIndicator>
            </CheckboxControl>
            <CheckboxLabel>{t(`searchPage.traits.${trait}`)}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        ))}
      </CheckboxGroup>
    </FilterContainer>
  );
};
