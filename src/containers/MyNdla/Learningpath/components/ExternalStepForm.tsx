/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CheckLine } from "@ndla/icons";
import {
  FieldLabel,
  FieldHelper,
  FieldRoot,
  Text,
  CheckboxRoot,
  CheckboxLabel,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxHiddenInput,
  FieldErrorMessage,
  FieldInput,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
import { URL_REGEX } from "../../../../util/urlHelper";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";
import { useFetchOpengraph } from "../learningpathQueries";

const StyledCheckboxRoot = styled(CheckboxRoot, {
  base: {
    width: "fit-content",
  },
});

const CopyrightText = styled(Text, {
  base: {
    maxWidth: "surface.large",
  },
});

const TITLE_MAX_LENGTH = 64;
const INTRODUCTION_MAX_LENGTH = 250;

export interface ExternalFormValues {
  type: "external";
  title: string;
  introduction: string;
  url: string;
  shareable: boolean;
}

export const ExternalStepForm = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<ExternalFormValues>();
  const [fetchOpengraph] = useFetchOpengraph({ skip: true });
  const { validationT } = useValidationTranslation();

  useEffect(() => {
    const { unsubscribe } = watch(async ({ url, title, introduction }, { name }) => {
      if (name === "url" && url?.length && url?.match(URL_REGEX) && (!title || !introduction)) {
        const { data } = await fetchOpengraph({ variables: { url } });
        if (!title) {
          setValue("title", data?.opengraph?.title ?? "");
        }
        if (!introduction) {
          setValue("introduction", data?.opengraph?.description ?? "");
        }
        setValue("shareable", false);
      }
    });
    return () => unsubscribe();
  }, [fetchOpengraph, setValue, watch]);

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
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.title.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.title.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={TITLE_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="introduction"
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
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.introduction.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.introduction.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={INTRODUCTION_MAX_LENGTH} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="url"
        rules={{
          required: validationT({
            type: "required",
            field: "url",
          }),
          validate: (value) => value.match(URL_REGEX) || t("validation.properUrl"),
        }}
        render={({ field, fieldState }) => (
          <FieldRoot required invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.content.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.content.labelHelper")}</FieldHelper>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
          </FieldRoot>
        )}
      />
      <Stack align="start" gap="small">
        <CopyrightText>
          {t("myNdla.learningpath.form.content.external.copyright")}
          <SafeLink to={"TODO"}>{t("myNdla.learningpath.form.content.external.copyrightLink")}</SafeLink>
        </CopyrightText>
        <Controller
          name="shareable"
          control={control}
          rules={{
            required: validationT({
              type: "required",
              field: "shareable",
            }),
          }}
          render={({ field, fieldState }) => (
            <FieldRoot required invalid={!!fieldState.error?.message}>
              <StyledCheckboxRoot
                checked={field.value}
                onCheckedChange={() => {
                  setValue("shareable", !field.value, {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              >
                <CheckboxControl>
                  <CheckboxIndicator asChild>
                    <CheckLine />
                  </CheckboxIndicator>
                </CheckboxControl>
                <CheckboxLabel>{t("myNdla.learningpath.form.content.external.checkbox")}</CheckboxLabel>
                <CheckboxHiddenInput />
              </StyledCheckboxRoot>
            </FieldRoot>
          )}
        />
      </Stack>
    </>
  );
};
