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
import { LearningpathStepDeleteDialog } from "./LearningpathStepDeleteDialog";
import { GQLMyNdlaLearningpathStepFragment } from "../../../../graphqlTypes";
import { getFormTypeFromStep, getValuesFromStep } from "../utils";

const ContentWrapper = styled("form", {
  base: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    gap: "medium",
    padding: "medium",
    border: "1px solid",
    borderColor: "stroke.discrete",
    background: "surface.default.subtle",
  },
});

// Temporary placement until forms are merged
export interface ExternalFormValues {
  type: "external";
  title: string;
  introduction: string;
  url: string;
  shareable: boolean;
}

export interface FolderFormValues {
  type: "folder";
  title: string;
  embedUrl: string;
}

export interface ResourceFormValues {
  type: "resource";
  embedUrl: string;
  title: string;
}
export interface TextFormValues {
  type: "text";
  title: string;
  introduction: string;
  description: string;
}

export type FormType = "text" | "external" | "resource" | "folder";

const radiogroupOptions = ["text", "resource", "external", "folder"];

export type FormValues = ExternalFormValues | FolderFormValues | ResourceFormValues | TextFormValues;

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
    defaultValues: stepType ? getValuesFromStep(stepType, step) : undefined,
  });
  const { handleSubmit, control, reset } = methods;

  return (
    <FormProvider {...methods}>
      <ContentWrapper onSubmit={handleSubmit(onSave)}>
        <Controller
          name="type"
          control={control}
          render={({ field, fieldState }) => (
            <FieldRoot>
              <FieldLabel>{t("myNdla.learningpath.form.content.title")}</FieldLabel>
              <FieldHelper>{t("myNdla.learningpath.form.content.subTitle")}</FieldHelper>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <RadioGroupRoot
                onValueChange={(details) => reset(getValuesFromStep(details.value as FormType, step))}
                orientation="vertical"
                {...field}
              >
                {radiogroupOptions.map((val) => (
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
        <HStack justify={onDelete ? "space-between" : "end"}>
          {onDelete ? <LearningpathStepDeleteDialog onDelete={onDelete} /> : null}
          <HStack>
            {onClose ? (
              <Button variant="secondary" onClick={onClose}>
                {t("cancel")}
              </Button>
            ) : null}
            <Button type="submit">{t("save")}</Button>
          </HStack>
        </HStack>
      </ContentWrapper>
    </FormProvider>
  );
};
