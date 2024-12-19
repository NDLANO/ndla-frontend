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
  Input,
  Text,
  CheckboxRoot,
  CheckboxLabel,
  CheckboxControl,
  CheckboxIndicator,
  CheckboxHiddenInput,
} from "@ndla/primitives";
import { SafeLink } from "@ndla/safelink";
import { Stack, styled } from "@ndla/styled-system/jsx";
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

export const ExternalForm = () => {
  const { t } = useTranslation();
  const { control, setValue, watch } = useFormContext<ExternalFormValues>();
  const { refetch } = useFetchOpengraph({ skip: true });
  const { validationT } = useValidationTranslation();

  useEffect(() => {
    const { unsubscribe } = watch(async ({ url, title, introduction }, { name }) => {
      if (name === "url" && url?.length && url?.length > 0 && (!title || !introduction)) {
        const { data } = await refetch({ url });
        if (!title) {
          setValue("title", data.opengraph?.title ?? "");
        }
        if (!introduction) {
          setValue("introduction", data.opengraph?.description ?? "");
        }
        setValue("shareable", false);
      }
    });
    return () => unsubscribe();
  }, [refetch, setValue, watch]);

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
        render={({ field }) => (
          <FieldRoot>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.title.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.title.labelHelper")}</FieldHelper>
            <Input {...field} />
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
        render={({ field }) => (
          <FieldRoot>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.introduction.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.introduction.labelHelper")}</FieldHelper>
            <Input {...field} />
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
        }}
        render={({ field }) => (
          <FieldRoot>
            <FieldLabel>{t("myNdla.learningpath.form.content.external.content.label")}</FieldLabel>
            <FieldHelper>{t("myNdla.learningpath.form.content.external.content.labelHelper")}</FieldHelper>
            <Input {...field} />
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
          render={({ field }) => (
            <FieldRoot>
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
