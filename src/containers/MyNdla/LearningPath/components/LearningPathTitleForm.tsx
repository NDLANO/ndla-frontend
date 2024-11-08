/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot, Heading, Text } from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLLearningPath } from "./LearningPathList";
import SearchMetaImage from "./SearchMetaImage";
import FieldLength from "../../../../containers/MyNdla/components/FieldLength";
import useValidationTranslation from "../../../../util/useValidationTranslation";

interface Props {
  learningpath?: GQLLearningPath;
  onSave: (values: LearningpathFormValues) => Promise<void>;
  loading?: boolean;
}

export interface LearningpathFormValues {
  title: string;
  metaImage: ReactNode | undefined;
}

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const ContentWrapper = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "small",
  },
});

const ButtonRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    paddingBlockStart: "small",
  },
});

const toFormValues = (learningpath: GQLLearningPath | undefined): LearningpathFormValues => {
  return {
    title: learningpath?.title ?? "",
    metaImage: learningpath?.metaImage ?? undefined,
  };
};

const nameMaxLength = 64;

function LearningPathTitleForm({ onSave, learningpath, loading }: Props) {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { control, handleSubmit } = useForm({ defaultValues: toFormValues(learningpath) });

  return (
    <StyledForm onSubmit={handleSubmit(onSave)} noValidate>
      <ContentWrapper>
        <Heading textStyle="heading.small">{t("myNdla.learningpath.learningpathTitle.title")}</Heading>
        <Controller
          control={control}
          name="title"
          rules={{
            required: validationT({ type: "required", field: "title" }),
            maxLength: {
              value: nameMaxLength,
              message: validationT({
                type: "maxLength",
                field: "title",
                vars: { count: nameMaxLength },
              }),
            },
            // Should we check for duplicate titles?
            // validate: (name) => {
            //   const exists = siblings.every((f) => f.name.toLowerCase() !== name.toLowerCase());
            //   if (!exists) {
            //     return validationT("validation.notUnique");
            //   }
            //   return true;
            // },
          }}
          render={({ field, fieldState }) => (
            <FieldRoot invalid={!!fieldState.error?.message}>
              <ContentWrapper>
                <FieldLabel fontWeight="bold" textStyle="label.large">
                  {t("title")}
                </FieldLabel>
                <Text textStyle="body.large">{t("myNdla.learningpath.learningpathTitle.description")}</Text>
              </ContentWrapper>
              <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
              <FieldInput {...field} />
              <FieldLength value={field.value?.length ?? 0} maxLength={nameMaxLength} />
            </FieldRoot>
          )}
        />
        <Controller
          control={control}
          name="metaImage"
          rules={{
            required: "Please select an image",
            validate: (value) => !!value,
          }}
          render={({ field: { onChange } }) => (
            <ContentWrapper>
              <Text textStyle="label.large">{t("myNdla.learningpath.metaImage.title")}</Text>
              <Text textStyle="body.large">{t("myNdla.learningpath.metaImage.description")}</Text>
              <SearchMetaImage onChange={onChange} />
            </ContentWrapper>
          )}
        />
      </ContentWrapper>
      <ButtonRow>
        <Button variant="secondary">{t("cancel")}</Button>
        <Button loading={loading} disabled={loading} type="submit" aria-label={loading ? t("loading") : undefined}>
          {t("continue")}
        </Button>
      </ButtonRow>
    </StyledForm>
  );
}

export default LearningPathTitleForm;
