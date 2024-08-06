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
  RadioGroupLabel,
  RadioGroupRoot,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MovieResourceType } from "./resourceTypes";

const StyledHeading = styled(Heading, {
  base: {
    marginBlockEnd: "medium",
  },
});
const LabelText = styled(RadioGroupLabel, {
  base: {
    marginBlockEnd: "small",
  },
});

const StyledRadioGroupRoot = styled(RadioGroupRoot, {
  base: {
    gap: "small",
  },
});

const RadioButtonWrapper = styled("div", {
  base: {
    display: "flex",
    gap: "small",
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
        <h2>{t("ndlaFilm.films")}</h2>
      </StyledHeading>
      <StyledRadioGroupRoot
        orientation="vertical"
        defaultValue={selectedOption?.id}
        onValueChange={(details) => onOptionSelected(options.find((option) => option.id === details.value)!)}
      >
        <LabelText textStyle="label.large" fontWeight="bold">
          {t("ndlaFilm.filterFilms")}
        </LabelText>
        <RadioButtonWrapper>
          {options.map((category, index) => (
            <RadioGroupItem key={`${category.id}-${index}`} value={category.id}>
              <RadioGroupItemControl />
              <RadioGroupItemText fontWeight="bold">{t(category.name)}</RadioGroupItemText>
              <RadioGroupItemHiddenInput />
            </RadioGroupItem>
          ))}
        </RadioButtonWrapper>
      </StyledRadioGroupRoot>
    </>
  );
};

export default FilmFiltering;
