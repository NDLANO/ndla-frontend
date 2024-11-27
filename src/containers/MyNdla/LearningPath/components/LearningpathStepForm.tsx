/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const ContentWrapper = styled("form", {
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

export const LearningpathStepForm = (_props: Props) => {
  const [currentType, setCurrentType] = useState<LearningstepType | undefined>(undefined);
  const { t } = useTranslation();

  return (
    <ContentWrapper>
      <Text fontWeight="bold">{t("myNdla.learningpath.form.title")}</Text>
      <Text textStyle="label.small">{t("myNdla.learningpath.form.subTitle")}</Text>
      <RadioGroupRoot
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
