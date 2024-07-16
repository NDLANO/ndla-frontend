/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Done } from "@ndla/icons/editor";
import {
  CheckboxControl,
  CheckboxGroup,
  CheckboxHiddenInput,
  CheckboxIndicator,
  CheckboxLabel,
  CheckboxRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});
const StyledText = styled(Text, { base: { marginBlock: "small" } });

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
    <div>
      <StyledText textStyle="title.small" id="tab-filter-label">
        {t("subjectsPage.tabFilter")}
      </StyledText>
      <StyledCheckboxGroup value={selectedValue} onValueChange={(v) => onChange(v)} aria-labelledby="tab-filter-label">
        {options.map((item) => (
          <CheckboxRoot key={item.value} value={item.value} variant="chip">
            <CheckboxControl>
              <CheckboxIndicator asChild>
                <Done />
              </CheckboxIndicator>
            </CheckboxControl>
            <CheckboxLabel>{item.label}</CheckboxLabel>
            <CheckboxHiddenInput />
          </CheckboxRoot>
        ))}
      </StyledCheckboxGroup>
    </div>
  );
};

export default TabFilter;
