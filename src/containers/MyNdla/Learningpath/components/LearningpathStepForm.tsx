/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
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
import { LearningpathStepDeleteDialog } from "./LearningpathStepDeleteDialog";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { formValues, getFormTypeFromStep, getValuesFromStep } from "../utils";
import { ExternalForm } from "./ExternalForm";
import { FolderForm } from "./FolderForm";
import { ResourceForm } from "./ResourceForm";
import { TextForm } from "./TextForm";

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
export type FormType = (typeof RADIO_GROUP_OPTIONS)[number];

export type FormValues = {
  type: string;
  title: string;
  introduction: string;
  description: string;
  embedUrl: string;
  url: string;
  shareable: boolean;
};

interface Props {
  learningpathId: number;
  step?: GQLMyNdlaLearningpathStepFragment;
  onClose?: VoidFunction;
  onDelete?: (close: VoidFunction) => Promise<void>;
  onSave: (data: FormValues) => Promise<void>;
}

export const LearningpathStepForm = ({ step, onClose, onSave, onDelete }: Props) => {
  const { t } = useTranslation();

  const stepType = getFormTypeFromStep(step);
  const methods = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: stepType ? getValuesFromStep(stepType, step) : formValues(),
  });

  const { handleSubmit, control, reset, formState } = methods;

  return (
    <FormProvider {...methods}>
      <ContentForm onSubmit={handleSubmit(onSave)}>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FieldRoot required>
              <FieldLabel>{t("myNdla.learningpath.form.content.title")}</FieldLabel>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <RadioGroupRoot
                onValueChange={(details) => reset(getValuesFromStep(details.value as FormType, step))}
                orientation="vertical"
                {...field}
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
            <Button type="submit" disabled={!formState.isDirty}>
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
      <ResourceForm
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
    return <ExternalForm />;
  } else if (formType === "text") {
    return <TextForm />;
  } else if (formType === "folder") {
    return <FolderForm />;
  }
  return null;
};
