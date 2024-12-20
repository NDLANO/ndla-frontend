/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  FieldErrorMessage,
  FieldHelper,
  FieldLabel,
  FieldRoot,
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupItemText,
  RadioGroupRoot,
} from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { ExternalForm } from "./ExternalForm";
import { LearningpathStepDeleteDialog } from "./LearningpathStepDeleteDialog";
import { ResourceForm } from "./ResourceForm";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { FormKeys, FormValues } from "../types";
import { toFormValues } from "../utils";
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

const LEARNINGPATH_FORM_VARIANTS: FormKeys[] = ["text", "resource", "external", "folder"];

interface Props {
  step?: GQLMyNdlaLearningpathStepFragment;
  defaultStepType: FormKeys;
  onClose?: VoidFunction;
  onDelete?: (close: VoidFunction) => Promise<void>;
  onSave: (data: FormValues) => Promise<void>;
}

export const LearningpathStepForm = ({ step, defaultStepType, onClose, onSave, onDelete }: Props) => {
  const { t } = useTranslation();

  const methods = useForm<FormValues>({
    defaultValues: toFormValues(defaultStepType, step),
  });
  const { handleSubmit, control, watch, reset, formState } = methods;

  return (
    <FormProvider {...methods}>
      <ContentForm onSubmit={handleSubmit(onSave)}>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FieldRoot>
              <FieldLabel>{t("myNdla.learningpath.form.content.title")}</FieldLabel>
              <FieldHelper>{t("myNdla.learningpath.form.content.subTitle")}</FieldHelper>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <RadioGroupRoot
                onValueChange={(details) => reset(toFormValues(details.value as FormKeys, step))}
                orientation="vertical"
                {...field}
              >
                {LEARNINGPATH_FORM_VARIANTS.map((val) => (
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
        {watch("type") === "resource" ? (
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
        ) : null}
        {watch("type") === "external" ? <ExternalForm /> : null}
        {watch("type") === "text" ? <TextForm /> : null}
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
