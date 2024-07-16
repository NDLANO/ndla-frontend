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

const StyledLegend = styled("legend", { base: { marginBlock: "small" } });

const StyledCheckboxGroup = styled(CheckboxGroup, {
  base: { display: "flex", flexDirection: "row", flexWrap: "wrap" },
});

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
    <fieldset>
      <StyledLegend>
        <Text textStyle="title.small">{t("subjectsPage.tabFilter")}</Text>
      </StyledLegend>
      <StyledCheckboxGroup value={selectedValue} onValueChange={(v) => onChange(v)}>
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
    </fieldset>
  );
};

export default TabFilter;
