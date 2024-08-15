/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId } from "react";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons/editor";
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
const StyledText = styled(Text, { base: { marginBlockEnd: "small" } });

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
  const tabFilterLabelId = useId();
  return (
    <div>
      {/* TODO: Update to Fieldset */}
      <StyledText textStyle="title.small" id={tabFilterLabelId}>
        {t("subjectsPage.tabFilter")}
      </StyledText>
      <StyledCheckboxGroup value={selectedValue} onValueChange={onChange} aria-labelledby={tabFilterLabelId}>
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
    </div>
  );
};

export default TabFilter;
