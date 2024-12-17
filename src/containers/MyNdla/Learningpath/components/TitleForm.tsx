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
import { SafeLinkButton } from "@ndla/safelink";
import { HStack, styled } from "@ndla/styled-system/jsx";
import { ImagePicker } from "./ImagePicker";
import { routes } from "../../../../routeHelpers";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "xsmall",
  },
});

const StyledHStack = styled(HStack, {
  base: {
    width: "100%",
  },
});

export interface TitleFormValues {
  title: string;
  imageUrl: string;
}
interface Props {
  onSave: (data: TitleFormValues) => Promise<void>;
  initialValues?: TitleFormValues;
}

const MAX_NAME_LENGTH = 64;

export const TitleForm = ({ onSave, initialValues }: Props) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();

  const { control, setValue, resetField, handleSubmit } = useForm<TitleFormValues>({
    values: {
      title: initialValues?.title ?? "",
      imageUrl: initialValues?.imageUrl ?? "",
    },
  });

  return (
    <StyledForm onSubmit={handleSubmit(onSave)} id="titleForm">
      <Heading textStyle="heading.small">{t("myNdla.learningpath.form.steps.title")}</Heading>
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
              {t("validation.fields.title")}
            </FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.title.titleHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={MAX_NAME_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="imageUrl"
        rules={{
          required: "Please select an image",
          validate: (value) => !!value,
        }}
        render={({ field }) => {
          return (
            <FieldRoot>
              <FieldLabel>{t("myNdla.learningpath.form.title.metaImage")}</FieldLabel>
              <FieldHelper>{t("myNdla.learningpath.form.title.metaImageHelper")}</FieldHelper>
              <ImagePicker
                imageUrl={field.value}
                onSelectImage={(image) =>
                  image?.id ? setValue("imageUrl", image.metaUrl) : resetField("imageUrl", { defaultValue: "" })
                }
              />
            </FieldRoot>
          );
        }}
      />
      {!initialValues ? (
        <StyledHStack justify="space-between">
          <StyledHStack>
            <SafeLinkButton to={routes.myNdla.learningpath} variant="secondary">
              {t("cancel")}
            </SafeLinkButton>
          </StyledHStack>
          <StyledHStack>
            <Button type="submit">{t("myNdla.learningpath.form.next")}</Button>
          </StyledHStack>
        </StyledHStack>
      ) : null}
    </StyledForm>
  );
};
