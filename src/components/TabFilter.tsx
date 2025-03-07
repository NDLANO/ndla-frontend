/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  RadioGroupRoot,
  RadioGroupLabel,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StyledRadioGroupRoot = styled(RadioGroupRoot, {
  base: {
    _horizontal: {
      flexDirection: "column",
    },
  },
});

const RadioButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
    flexWrap: "wrap",
  },
});

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

const TabFilter = ({ value: selectedValue, onChange, options }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledRadioGroupRoot
      orientation="horizontal"
      value={selectedValue}
      onValueChange={(details) => (details.value ? onChange(details.value) : undefined)}
    >
      <RadioGroupLabel>{t("subjectsPage.tabFilter.label")}</RadioGroupLabel>
      <RadioButtonWrapper>
        {options.map((option) => (
          <RadioGroupItem value={option.value} key={option.value}>
            <RadioGroupItemControl />
            <RadioGroupItemText>{option.label}</RadioGroupItemText>
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
        ))}
      </RadioButtonWrapper>
    </StyledRadioGroupRoot>
  );
};

export default TabFilter;
