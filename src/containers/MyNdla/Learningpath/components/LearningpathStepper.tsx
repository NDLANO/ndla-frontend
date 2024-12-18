/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from "react-i18next";
import { Text } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { SchemaStates } from "../EditLearningpathPage";

const StepWrapper = styled("ol", {
  base: {
    display: "flex",
    listStyle: "none",
    gap: "4xsmall",
    tabletWideDown: {
      display: "none",
    },
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

const NumberText = styled(Text, {
  base: {
    borderRadius: "50%",
    borderColor: "stroke.default",
    border: "1px solid",
    paddingInline: "3xsmall",
    width: "2.5ch",
    textAlign: "center",
    _selected: {
      backgroundColor: "surface.brand.1",
    },
  },
});

const Line = styled("div", {
  base: {
    display: "block",
    borderStyle: "inset",
    borderBlockEnd: "1px solid",
    width: "xsmall",
    borderColor: "icon.strong",
    justifyContent: "center",
    alignItems: "center",
  },
});

interface Props {
  step: SchemaStates;
}

const STEPS = ["title", "content", "preview", "save"] as const;

export const LearningpathStepper = ({ step }: Props) => {
  return (
    <>
      <DesktopStepper step={step} />
      <MobileStepper step={step} />
    </>
  );
};

const DesktopStepper = ({ step }: Props) => {
  const { t } = useTranslation();

  return (
    <StepWrapper>
      {STEPS.map((key, idx) => (
        <Step key={idx}>
          <NumberText aria-selected={step === key} asChild consumeCss>
            <span>{idx + 1}</span>
          </NumberText>
          <Text>{t(`myNdla.learningpath.form.steps.${key}`)}</Text>
          <Line />
        </Step>
      ))}
    </StepWrapper>
  );
};

const MobileStepWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "surface.brand.1.subtle",
    paddingInline: "xsmall",
    paddingBlock: "small",
    gap: "xsmall",
    tabletWide: {
      display: "none",
    },
  },
});

const StepCircle = styled("div", {
  base: {
    display: "flex",
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
    height: "xxlarge",
    width: "xxlarge",
    borderRadius: "150px",
    border: "2px solid",
    borderColor: "stroke.info",
    transform: "rotate(45deg)",
  },
  defaultVariants: {
    step: "title",
  },
  variants: {
    step: {
      title: {
        borderTopColor: "stroke.default",
      },
      content: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
      },
      preview: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
        borderBottomColor: "stroke.default",
      },
      save: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
        borderBottomColor: "stroke.default",
        borderLeftColor: "stroke.default",
      },
    },
  },
});

const CounterText = styled(Text, {
  base: {
    transform: "rotate(-45deg)",
  },
});

const MobileStepper = ({ step }: Props) => {
  const index = STEPS.indexOf(step);
  const { t } = useTranslation();

  return (
    <MobileStepWrapper>
      <StepCircle step={step}>
        <CounterText consumeCss asChild>
          <span>{index + 1}/4</span>
        </CounterText>
      </StepCircle>
      <Stack align="start" gap="4xsmall">
        <Text fontWeight="bold" textStyle="label.medium">
          {t(`myNdla.learningpath.form.steps.${step}`)}
        </Text>
        {index !== 3 ? (
          <Text textStyle="label.small">
            {t("myNdla.learningpath.form.steps.next", {
              next: t(`myNdla.learningpath.form.steps.${step}`),
            })}
          </Text>
        ) : null}
      </Stack>
    </MobileStepWrapper>
  );
};
