/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Label,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.discrete",
    background: "surface.default.subtle",
  },
});

type LearningstepType = "text" | "resource" | "external" | "folder";

interface Props {
  contentType?: LearningstepType;
}
const RadiogroupOptions = ["text", "resource", "external", "folder"];

export const LearningpathStepForm = ({ contentType }: Props) => {
  const [currentType, setCurrentType] = useState<LearningstepType | undefined>(contentType);
  const id = useId();
  const { t } = useTranslation();

  return (
    <ContentWrapper>
      <Label fontWeight="bold" htmlFor={id}>
        {t("myNdla.learningpath.form.content.title")}
      </Label>
      <Text textStyle="label.small">{t("myNdla.learningpath.form.content.subTitle")}</Text>
      <RadioGroupRoot
        id={id}
        value={currentType}
        onValueChange={(details) => setCurrentType(details.value as LearningstepType)}
        orientation="vertical"
      >
        {RadiogroupOptions.map((val) => (
          <RadioGroupItem value={val} key={val}>
            <RadioGroupItemControl />
            <RadioGroupItemText>{t(`myNdla.learningpath.form.options.${val}`)}</RadioGroupItemText>
            <RadioGroupItemHiddenInput />
          </RadioGroupItem>
        ))}
      </RadioGroupRoot>
    </ContentWrapper>
  );
};
