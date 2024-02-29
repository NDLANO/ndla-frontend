/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { ButtonV2, LoadingButton } from "@ndla/button";
import { colors, spacing } from "@ndla/core";
import { FormControl, InputV3, Label, FieldErrorMessage, CheckboxItem } from "@ndla/forms";
import { INewCategory } from "@ndla/types-backend/myndla-api";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import { FieldLength } from "../../Folders/FolderForm";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const StyledLabel = styled(Label)`
  margin: 0;
  margin-bottom: ${spacing.xxsmall};
`;

const FieldInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
`;

const StyledInput = styled(InputV3)`
  background: ${colors.white};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  gap: ${spacing.small};
  align-items: center;
`;

interface ArenaFormProps {
  initialTitle?: string;
  initialDescription?: string;
  initialVisible?: boolean;
  onSave: (data: Partial<INewCategory>) => Promise<void>;
  onAbort: () => void;
  loading?: boolean;
  id?: number;
}

export interface ArenaCategory {
  title: string;
  content: string;
}

const titleMaxLength = 64;

const ArenaCategoryForm = ({ onSave, onAbort, initialTitle, initialDescription, initialVisible }: ArenaFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { formState, trigger, control, handleSubmit, setValue } = useForm({
    defaultValues: {
      title: initialTitle ?? "",
      description: initialDescription ?? "",
      visible: initialVisible ?? true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    setTimeout(() => document.getElementById(`field-editor`)?.focus(), 1);
  }, []);

  const onSubmit = async (data: INewCategory) => {
    await onSave({
      title: data.title,
      description: data.description,
      visible: data.visible,
    });
  };

  const formIsSubmittable = formState.isValid && formState.isDirty;

  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="title"
        rules={{
          required: validationT({ type: "required", field: "title" }),
          maxLength: {
            value: 64,
            message: validationT({
              type: "maxLength",
              field: "title",
              vars: { count: titleMaxLength },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FormControl id="title" isRequired isInvalid={!!fieldState.error?.message}>
            <StyledLabel textStyle="label-small">{t("myNdla.arena.admin.category.form.title")}</StyledLabel>
            <StyledInput {...field} />
            <FieldInfoWrapper>
              <FieldLength value={field.value.length ?? 0} maxLength={titleMaxLength} />
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            </FieldInfoWrapper>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FormControl id="editor" isRequired isInvalid={!!fieldState.error?.message}>
            <StyledLabel textStyle="label-small">{t("myNdla.arena.admin.category.form.description")}</StyledLabel>
            <StyledInput {...field} />
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
          </FormControl>
        )}
      />
      <Controller
        control={control}
        name="visible"
        rules={{
          required: false,
        }}
        render={({ field, fieldState }) => (
          <FormControl id="visible" isInvalid={!!fieldState.error?.message}>
            <CheckboxWrapper>
              <CheckboxItem
                checked={field.value}
                onCheckedChange={() => {
                  setValue("visible", !field.value, {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }}
              />
              <Label margin="none" textStyle="label-small">
                {t("myNdla.arena.admin.category.form.visible")}
              </Label>
            </CheckboxWrapper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
          </FormControl>
        )}
      />
      <ButtonRow>
        <ButtonV2 variant="outline" onClick={onAbort}>
          {t("cancel")}
        </ButtonV2>
        <LoadingButton colorTheme="primary" type="submit" disabled={!formIsSubmittable}>
          {t("myNdla.arena.publish")}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

export default ArenaCategoryForm;
