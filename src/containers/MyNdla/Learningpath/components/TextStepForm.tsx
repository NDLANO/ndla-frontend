/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Descendant } from "slate";
import { ContentEditableFieldLabel } from "@ndla/editor-components";
import { Text, FieldErrorMessage, FieldHelper, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { RichTextEditor } from "../../../../components/RichTextEditor/RichTextEditor";
import { useValidationTranslation } from "../../../../util/useValidationTranslation";
import { FieldLength } from "../../components/FieldLength";

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

export interface TextFormValues {
  type: "text";
  title: string;
  introduction: string;
  description: Descendant[];
}

export const TextStepForm = () => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { control } = useFormContext<TextFormValues>();

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
          <FieldRoot invalid={!!fieldState.error?.message} required>
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
          <FieldRoot invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.learningpath.form.content.text.introduction.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.introduction.labelHelper")}</FieldHelper>
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
        // Slate doesn't support value
        render={({ field: { value, ...rest }, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message} required>
            <ContentEditableFieldLabel>
              {t("myNdla.learningpath.form.content.text.description.label")}
            </ContentEditableFieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.text.description.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <RichTextEditor initialValue={value} {...rest} />
          </FieldRoot>
        )}
      />
      <Text>
        {`${t("myNdla.learningpath.form.content.text.copyright")} `}
        <SafeLink
          to="https://support.ndla.no/hc/no/articles/360000945552-Bruk-av-lisenser-og-lisensiering"
          target="_blank"
        >
          {t("myNdla.learningpath.form.content.text.copyrightLink")}
        </SafeLink>
      </Text>
    </>
  );
};
