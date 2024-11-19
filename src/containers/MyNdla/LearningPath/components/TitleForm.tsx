/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldHelper, FieldInput, FieldLabel, FieldRoot, Heading } from "@ndla/primitives";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { ImagePicker } from "./ImagePicker";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

interface FormValues {
  title: string;
  imageId: string;
}

interface Props {
  initialValue?: FormValues;
  onSave: (values: FormValues) => void;
}

const MAX_NAME_LENGTH = 64;

export const TitleForm = ({ initialValue, onSave }: Props) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { control, handleSubmit, setValue, getValues } = useForm<FormValues>({
    values: initialValue,
  });

  return (
    <StyledForm onSubmit={handleSubmit(onSave)}>
      <Heading textStyle="heading.small">{t("myNdla.learningpath.learningpathTitle.title")}</Heading>
      <Controller
        control={control}
        name="title"
        rules={{
          required: validationT({ type: "required", field: "title" }),
          maxLength: {
            value: MAX_NAME_LENGTH,
            message: validationT({
              type: "maxLength",
              field: "title",
              vars: { count: MAX_NAME_LENGTH },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message}>
            <FieldLabel fontWeight="bold" textStyle="label.large">
              {t("title")}
            </FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.learningpathTitle.description")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={MAX_NAME_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="imageId"
        rules={{
          required: "Please select an image",
          validate: (value) => !!value,
        }}
        render={() => (
          <FieldRoot>
            <ImagePicker imageId={getValues("imageId")} setImageForm={(image) => setValue("imageId", image?.id!)} />
          </FieldRoot>
        )}
      />
      <HStack justify="space-between">
        <Button variant="secondary">{t("cancel")}</Button>
        <Button type="submit">{t("continue")}</Button>
      </HStack>
    </StyledForm>
  );
};
