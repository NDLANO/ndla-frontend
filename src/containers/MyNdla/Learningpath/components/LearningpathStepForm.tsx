/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { Controller, FormProvider, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  FieldErrorMessage,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { ExternalStepForm } from "./ExternalStepForm";
import { FolderStepForm } from "./FolderStepForm";
import { LearningpathStepDeleteDialog } from "./LearningpathStepDeleteDialog";
import { ResourceStepForm } from "./ResourceStepForm";
import { TextStepForm } from "./TextStepForm";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { toFormValues } from "../learningpathFormUtils";
import { FormValues } from "../types";

const ContentForm = styled("form", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.discrete",
    background: "surface.subtle",
  },
});

const RADIO_GROUP_OPTIONS = ["text", "resource", "external", "folder"] as const;

interface Props {
  step?: GQLMyNdlaLearningpathStepFragment;
  stepType: FormValues["type"];
  onClose?: VoidFunction;
  onDelete?: (close: VoidFunction) => Promise<void>;
  onSave: (data: FormValues) => Promise<void>;
}

export const LearningpathStepForm = ({ step, stepType, onClose, onSave, onDelete }: Props) => {
  const { t } = useTranslation();

  const methods = useFormContext<FormValues>();
  const { handleSubmit, control, reset, formState } = methods;

  useEffect(() => {
    reset(toFormValues(stepType, step));
  }, [reset, step, stepType]);

  return (
    <FormProvider {...methods}>
      <ContentForm onSubmit={handleSubmit(onSave)} noValidate>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FieldRoot required>
              <FieldLabel>{t("myNdla.learningpath.form.content.title")}</FieldLabel>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <RadioGroupRoot
                onValueChange={(details) => {
                  reset(toFormValues(details.value as FormValues["type"]));
                  field.onChange(details.value);
                }}
                value={field.value}
                ref={field.ref}
                disabled={field.disabled}
                name={field.name}
                onBlur={field.onBlur}
                orientation="vertical"
              >
                {RADIO_GROUP_OPTIONS.map((val) => (
                  <RadioGroupItem value={val} key={val}>
                    <RadioGroupItemControl />
                    <RadioGroupItemText>{t(`myNdla.learningpath.form.options.${val}`)}</RadioGroupItemText>
                    <RadioGroupItemHiddenInput />
                  </RadioGroupItem>
                ))}
              </RadioGroupRoot>
            </FieldRoot>
          )}
        />
        <StepFormType step={step} />
        <HStack justify={onDelete ? "space-between" : "end"}>
          {onDelete ? <LearningpathStepDeleteDialog onDelete={onDelete} /> : null}
          <HStack>
            {onClose ? (
              <Button variant="secondary" onClick={onClose}>
                {t("cancel")}
              </Button>
            ) : null}
            <Button type="submit" disabled={!formState.isDirty || formState.isSubmitting}>
              {t("save")}
            </Button>
          </HStack>
        </HStack>
      </ContentForm>
    </FormProvider>
  );
};

interface StepFormTypeProps {
  step: GQLMyNdlaLearningpathStepFragment | undefined;
}

const StepFormType = ({ step }: StepFormTypeProps) => {
  const { watch } = useFormContext<FormValues>();
  const formType = watch("type");

  if (formType === "resource") {
    return (
      <ResourceStepForm
        resource={
          step?.resource
            ? {
                resourceTypes: step.resource.resourceTypes,
                title: step.title,
                breadcrumbs: step.resource.breadcrumbs,
                url: step.embedUrl?.url ?? "",
              }
            : undefined
        }
      />
    );
  } else if (formType === "external") {
    return <ExternalStepForm />;
  } else if (formType === "text") {
    return <TextStepForm initialValue={step?.description ?? ""} />;
  } else if (formType === "folder") {
    return <FolderStepForm />;
  }
  return null;
};

export default LearningpathStepForm;
