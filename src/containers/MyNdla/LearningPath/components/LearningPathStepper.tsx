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

const StepWrapper = styled("ol", {
  base: {
    display: "flex",
    listStyle: "none",
    gap: "4xsmall",
    mobileWideDown: {
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

const MobileStepWrapper = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "surface.brand.1.subtle",
    paddingInline: "xsmall",
    paddingBlock: "small",
    gap: "xsmall",
    mobileWide: {
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
    step: 1,
  },
  variants: {
    step: {
      1: {
        borderTopColor: "stroke.default",
      },
      2: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
      },
      3: {
        borderTopColor: "stroke.default",
        borderRightColor: "stroke.default",
        borderBottomColor: "stroke.default",
      },
      4: {
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

interface Props {
  stepKey: "title" | "content" | "preview" | "save";
}

const STEPS = ["title", "content", "preview", "save"];

export const LearningPathStepper = ({ stepKey }: Props) => {
  const { t } = useTranslation();

  const index_key = STEPS.indexOf(stepKey) as 1 | 2 | 3 | 4;

  return (
    <>
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
      <MobileStepWrapper>
        <StepCircle step={index_key}>
          <CounterText consumeCss asChild>
            <span>{index_key + 1}/4</span>
          </CounterText>
        </StepCircle>
        <Stack align="start" gap="4xsmall">
          <Text fontWeight="bold" textStyle="label.medium">
            {t(`myNdla.learningpath.form.steps.${STEPS[index_key]}`)}
          </Text>
          {index_key !== 4 ? (
            <Text textStyle="label.small">
              {t("myNdla.learningpath.form.steps.next", {
                next: t(`myNdla.learningpath.form.steps.${STEPS[index_key + 1]}`),
              })}
            </Text>
          ) : null}
        </Stack>
      </MobileStepWrapper>
    </>
  );
};
