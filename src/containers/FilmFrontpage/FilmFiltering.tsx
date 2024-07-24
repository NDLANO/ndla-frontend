/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Done } from "@ndla/icons/editor";
import {
  Heading,
  RadioGroupItem,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { MovieResourceType } from "./resourceTypes";

const StyledRadioGroupItem = styled(RadioGroupItem, {
  base: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4xsmall",
    color: "text.default",

    paddingBlock: "4xsmall",
    paddingInline: "xsmall",

    border: "1px solid",
    borderRadius: "100px",
    borderColor: "stroke.subtle",

    backgroundColor: "surface.actionSubtle",

    // TODO Fiks når vi har fått nye ICONS inn
    "& svg": {
      display: "none",
    },

    _hover: {
      backgroundColor: "surface.actionSubtle.hover",
      color: "text.default",
    },

    _checked: {
      backgroundColor: "surface.actionSubtle.selected",
      color: "text.onAction",
      "& svg": {
        display: "block",
      },
    },
  },
});

const StyledRadioGroupItemText = styled(RadioGroupItemText, {
  base: {
    color: "text.default",
    _hover: {
      color: "text.default",
    },
    _checked: {
      color: "text.onAction",
    },
  },
});

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
          <StyledRadioGroupItem key={`${category.id}-${index}`} value={category.id}>
            <Done />
            <StyledRadioGroupItemText fontWeight="bold">{t(category.name)}</StyledRadioGroupItemText>
            <RadioGroupItemHiddenInput />
          </StyledRadioGroupItem>
        ))}
      </RadioGroupRoot>
    </>
  );
};

export default FilmFiltering;
