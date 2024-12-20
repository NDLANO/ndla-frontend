/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { t } from "i18next";
import { lazy, Suspense } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FieldErrorMessage, FieldHelper, FieldInput, FieldLabel, FieldRoot, Spinner } from "@ndla/primitives";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

const MarkdownEditor = lazy(() => import("../../../../components/MarkdownEditor/MarkdownEditor"));

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

export interface TextFormValues {
  type: "text";
  title: string;
  introduction: string;
  description: string;
}

export const TextForm = () => {
  const { validationT } = useValidationTranslation();
  const { setValue, control } = useFormContext<TextFormValues>();

  return (
    <>
      <Controller
        control={control}
        name="title"
        rules={{
          required: validationT({
            type: "required",
            field: "title",
          }),
          maxLength: {
            value: TITLE_MAX_LENGTH,
            message: validationT({
              type: "maxLength",
              field: "title",
              vars: { count: TITLE_MAX_LENGTH },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot>
            <FieldLabel>{t("myNdla.learningpath.form.content.text.title.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.title.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        name="introduction"
        control={control}
        rules={{
          required: validationT({
            type: "required",
            field: "introduction",
          }),
          maxLength: {
            value: INTRODUCTION_MAX_LENGTH,
            message: validationT({
              type: "maxLength",
              field: "introduction",
              vars: { count: INTRODUCTION_MAX_LENGTH },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot>
            <FieldLabel>{t("myNdla.learningpath.form.content.text.introduction.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.introduction.label")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field?.value?.length ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          required: validationT({
            type: "required",
            field: "description",
          }),
        }}
        render={({ field, fieldState }) => (
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel onClick={() => document.getElementById("markdown-editor")?.focus()}>
              {t("myNdla.learningpath.form.content.text.description.label")}
            </FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.description.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <Suspense fallback={<Spinner />}>
              <MarkdownEditor
                setContentWritten={(val) => {
                  setValue("description", val, {
                    shouldDirty: true,
                  });
                }}
                initialValue={field.value ?? "<p></p>"}
                {...field}
              />
            </Suspense>
          </FieldRoot>
        )}
      />
    </>
  );
};
