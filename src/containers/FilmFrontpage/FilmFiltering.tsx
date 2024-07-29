/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import {
  Heading,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MovieResourceType } from "./resourceTypes";

const StyledHeading = styled(Heading, {
  base: {
    paddingBlockEnd: "medium",
  },
});
const LabelText = styled(Text, {
  base: {
    paddingBlockEnd: "small",
  },
});

interface Props {
  onOptionSelected: (resourceType: MovieResourceType) => void;
  options: MovieResourceType[];
  selectedOption?: MovieResourceType;
}

const FilmFiltering = ({ onOptionSelected, options, selectedOption }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <StyledHeading textStyle="heading.small" consumeCss asChild>
        <h2>{t("Filmer")}</h2>
      </StyledHeading>
      <LabelText textStyle="label.large" fontWeight="bold">
        {t("Filtrer filmer")}
      </LabelText>
      <RadioGroupRoot
        orientation="horizontal"
        defaultValue={selectedOption?.id}
        onValueChange={(details) => onOptionSelected(options.find((option) => option.id === details.value)!)}
      >
        {options.map((category, index) => (
          <RadioGroupItem key={`${category.id}-${index}`} value={category.id}>
            <RadioGroupItemControl />
            <RadioGroupItemText fontWeight="bold">{t(category.name)}</RadioGroupItemText>
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
        ))}
      </RadioGroupRoot>
    </>
  );
};

export default FilmFiltering;
