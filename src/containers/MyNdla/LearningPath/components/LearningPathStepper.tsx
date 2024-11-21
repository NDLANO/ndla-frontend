/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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

const Line = styled("hr", {
  base: {
    display: "block",
    borderStyle: "inset",
    borderBlockEnd: "1px solid",
    width: "xsmall",
    borderColor: "icon.strong",
  },
});

interface Props {
  stepKey: string;
}

interface Steps {
  title: string;
  key: string;
}

const steps: Steps[] = [
  {
    title: "Tittel og beskrivelse",
    key: "title",
  },
  {
    title: "Legg til innhold",
    key: "content",
  },
  {
    title: "Se igjennom",
    key: "preview",
  },
  {
    title: "Lagre og del",
    key: "save",
  },
];

export const LearningPathStepper = ({ stepKey }: Props) => {
  return (
    <StepWrapper>
      {steps.map((step, idx) => (
        <Step key={idx}>
          <NumberSpan aria-selected={stepKey === step.key} asChild consumeCss>
            <span>{idx + 1}</span>
          </NumberSpan>
          <Text>{step.title}</Text>
          <Line />
        </Step>
      ))}
    </StepWrapper>
  );
};
