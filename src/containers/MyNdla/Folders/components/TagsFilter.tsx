/**
 * Copyright (c) 2026-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CheckLine } from "@ndla/icons";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  FieldsetLegend,
  FieldsetRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { uniq } from "@ndla/util";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GQLFolder } from "../../../../graphqlTypes";
import { useStableSearchParams } from "../../../../util/useStableSearchParams";

interface Props {
  folder: GQLFolder;
}

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const StyledFieldsetRoot = styled(FieldsetRoot, {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

export const TagsFilter = ({ folder }: Props) => {
  const { t } = useTranslation();
  const [params, setParams] = useStableSearchParams();
  const activeTags = params.get("tags")?.split(",") ?? [];

  const tags = useMemo(() => {
    return uniq(folder.resources.flatMap((r) => r.tags));
  }, [folder]);

  if (!tags.length) {
    return <div />;
  }

  return (
    <StyledFieldsetRoot>
      <FieldsetLegend textStyle="label.large" fontWeight="normal">
        {t("myNdla.folder.filterByTags")}
      </FieldsetLegend>
      <StyledCheckboxGroup
        value={activeTags}
        onValueChange={(value) => setParams({ tags: value.join(",") }, { replace: false, preventScrollReset: true })}
      >
        {tags.map((tag) => (
          <CheckboxRoot variant="chip" key={tag} value={tag}>
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <CheckLine />
              </CheckboxIndicator>
            </CheckboxControl>
            {/* TODO: This can overflow on long tags. Consider wrapping or ellipsis */}
            <CheckboxLabel>{tag}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        ))}
      </StyledCheckboxGroup>
    </StyledFieldsetRoot>
  );
};
