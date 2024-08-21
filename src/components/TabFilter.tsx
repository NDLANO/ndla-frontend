/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
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

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});
const StyledFieldsetRoot = styled(FieldsetRoot, { base: { display: "flex", gap: "small" } });

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string[];
  onChange: (value: string[]) => void;
  options: Option[];
}

const TabFilter = ({ value: selectedValue, onChange, options }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledFieldsetRoot>
      <FieldsetLegend textStyle="title.small">{t("subjectsPage.tabFilter")}</FieldsetLegend>
      <StyledCheckboxGroup value={selectedValue} onValueChange={onChange}>
        {options.map((item) => (
          <CheckboxRoot key={item.value} value={item.value} variant="chip">
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <CheckLine />
              </CheckboxIndicator>
            </CheckboxControl>
            <CheckboxLabel>{item.label}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        ))}
      </StyledCheckboxGroup>
    </StyledFieldsetRoot>
  );
};

export default TabFilter;
