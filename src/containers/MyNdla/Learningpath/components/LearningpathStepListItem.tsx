/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ComponentPropsWithRef, forwardRef, lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilLine, CloseLine } from "@ndla/icons";
import { Button, Spinner, Text } from "@ndla/primitives";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { formValuesToGQLInput } from "../learningpathFormUtils";
import { useUpdateLearningpathStep } from "../learningpathMutations";
import { FormValues } from "../types";
import { getFormTypeFromStep, learningpathStepId } from "../utils";

const LearningpathStepForm = lazy(() => import("./LearningpathStepForm"));

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "stroke.subtle",
    padding: "xsmall",
  },
  variants: {
    editing: {
      true: {
        backgroundColor: "surface.subtle.selected",
        borderInline: "1px solid",
        borderBlockStart: "1px solid",
        borderBlockEnd: "none",
        borderColor: "stroke.discrete",
        borderRadius: "unset",
      },
    },
  },
});

interface Props extends ComponentPropsWithRef<"li"> {
  learningpathId: number;
  step: GQLMyNdlaLearningpathStepFragment;
  onDelete: (stepId: number, close: VoidFunction) => Promise<void>;
}

export const LearningpathStepListItem = forwardRef<HTMLLIElement, Props>(
  ({ step, learningpathId, onDelete, ...rest }, ref) => {
    const [isEditing, setIsEditing] = useState(false);

    const { t, i18n } = useTranslation();

    const [updateStep] = useUpdateLearningpathStep();

    const onSave = async (data: FormValues) => {
      const transformedData = formValuesToGQLInput(data);
      await updateStep({
        variables: {
          learningpathId: learningpathId,
          learningstepId: step.id,
          params: { ...transformedData, language: i18n.language, revision: step.revision },
        },
      });
      setIsEditing(false);
      setTimeout(() => document.getElementById(learningpathStepId(step.id))?.focus(), 0);
    };

    const onClose = () => {
      setIsEditing(false);
    };

    const stepType = getFormTypeFromStep(step);

    return (
      <li ref={ref} {...rest}>
        <ContentWrapper editing={isEditing}>
          <Stack gap="xxsmall">
            <Text fontWeight="bold" textStyle="label.medium">
              {step.title}
            </Text>
            <Text textStyle="label.small">{t(`myNdla.learningpath.form.options.${stepType}`)}</Text>
          </Stack>
          {!isEditing ? (
            <Button variant="tertiary" onClick={() => setIsEditing(true)}>
              {t("myNdla.learningpath.form.steps.edit")} <PencilLine />
            </Button>
          ) : (
            <Button variant="tertiary" onClick={onClose}>
              <CloseLine />
              {t("close")}
            </Button>
          )}
        </ContentWrapper>
        {isEditing ? (
          <Suspense fallback={<Spinner />}>
            <LearningpathStepForm
              step={step}
              stepType={stepType}
              onSave={onSave}
              onDelete={(close) => onDelete(step.id, close)}
            />
          </Suspense>
        ) : null}
      </li>
    );
  },
);
