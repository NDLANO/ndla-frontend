/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";

const StepWrapper = styled("ol", {
  base: {
    display: "flex",
    listStyle: "none",
    gap: "4xsmall",
  },
});

const Step = styled("li", {
  base: {
    display: "flex",
    gap: "4xsmall",
    alignItems: "center",
    _last: {
      "& div": {
        display: "none",
      },
    },
  },
});

const NumberSpan = styled(Text, {
  base: {
    borderRadius: "50%",
    borderColor: "stroke.default",
    border: "1px solid",
    paddingInline: "3xsmall",
    width: "2.5ch",
    textAlign: "center",
    _selected: {
      backgroundColor: "surface.action.brand.1.hover",
    },
  },
});

const Line = styled("div", {
  base: {
    display: "block",
    borderStyle: "inset",
    borderBlockEnd: "2px solid",
    width: "xsmall",
    borderColor: "icon.strong",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface Props {
  stepKey: "title" | "content" | "preview" | "save";
}

const STEPS = ["title", "content", "preview", "save"];

export const LearningPathStepper = ({ stepKey }: Props) => {
  const { t } = useTranslation();

  return (
    <StepWrapper>
      {STEPS.map((step, idx) => (
        <Step key={idx}>
          <NumberSpan aria-selected={stepKey === step} asChild consumeCss>
            <span>{idx + 1}</span>
          </NumberSpan>
          <Text>{t(`myNdla.learningpath.form.steps.${step}`)}</Text>
          <Line />
        </Step>
      ))}
    </StepWrapper>
  );
};
