/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot, Heading, Text } from "@ndla/primitives";
import { HStack } from "@ndla/styled-system/jsx";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

interface FormValues {
  title: string;
  imageId: number;
}

interface Props {
  initialValue?: FormValues;
  onSave: (values: FormValues) => VoidFunction;
}

const MAX_NAME_LENGTH = 64;

const TitleForm = ({ initialValue, onSave }: Props) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { control, handleSubmit } = useForm<FormValues>({
    values: initialValue,
  });

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <HStack>
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
              <HStack>
                <FieldLabel fontWeight="bold" textStyle="label.large">
                  {t("title")}
                </FieldLabel>
                <Text textStyle="body.large">{t("myNdla.learningpath.learningpathTitle.description")}</Text>
              </HStack>
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
          render={({ field: { onChange } }) => (
            <HStack>
              <Text textStyle="label.large">{t("myNdla.learningpath.metaImage.title")}</Text>
              <Text textStyle="body.large">{t("myNdla.learningpath.metaImage.description")}</Text>
            </HStack>
          )}
        />
      </HStack>
      <HStack>
        <Button variant="secondary">{t("cancel")}</Button>
        <Button type="submit">{t("continue")}</Button>
      </HStack>
    </form>
  );
};
