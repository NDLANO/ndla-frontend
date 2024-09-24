/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TFunction } from "i18next";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InformationLine } from "@ndla/icons/common";
import {
  Button,
  DialogCloseTrigger,
  FieldErrorMessage,
  FieldInput,
  FieldLabel,
  FieldRoot,
  FieldTextArea,
  MessageBox,
  Text,
} from "@ndla/primitives";
import { styled } from "@ndla/styled-system/jsx";
import { GQLFolder } from "../../../../graphqlTypes";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

interface EditFolderFormProps {
  folder?: GQLFolder;
  onSave: (values: FolderFormValues) => Promise<void>;
  siblings: GQLFolder[];
  loading?: boolean;
}

const ButtonRow = styled("div", {
  base: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "3xsmall",
    paddingBlockStart: "small",
  },
});

const StyledForm = styled("form", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: "medium",
  },
});

export interface FolderFormValues {
  name: string;
  description?: string;
}

const toFormValues = (folder: GQLFolder | undefined, t: TFunction): FolderFormValues => {
  return {
    name: folder?.name ?? "",
    description: folder?.description ?? t("myNdla.sharedFolder.description.all"),
  };
};

const descriptionMaxLength = 300;
const nameMaxLength = 64;

const FolderForm = ({ folder, onSave, siblings, loading }: EditFolderFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const { control, handleSubmit } = useForm({ defaultValues: toFormValues(folder, t) });

  return (
    <StyledForm onSubmit={handleSubmit(onSave)} noValidate>
      <Controller
        control={control}
        name="name"
        rules={{
          required: validationT({ type: "required", field: "name" }),
          maxLength: {
            value: nameMaxLength,
            message: validationT({
              type: "maxLength",
              field: "name",
              vars: { count: nameMaxLength },
            }),
          },
          validate: (name) => {
            const exists = siblings.every((f) => f.name.toLowerCase() !== name.toLowerCase());
            if (!exists) {
              return validationT("validation.notUnique");
            }
            return true;
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message}>
            <FieldLabel fontWeight="bold">{t("validation.fields.name")}</FieldLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={nameMaxLength} />
          </FieldRoot>
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{
          maxLength: {
            value: descriptionMaxLength,
            message: validationT({
              type: "maxLength",
              field: "description",
              vars: { count: descriptionMaxLength },
            }),
          },
        }}
        render={({ field, fieldState }) => (
          <FieldRoot invalid={!!fieldState.error?.message}>
            <FieldLabel>{t("validation.fields.description")}</FieldLabel>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <FieldTextArea {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={descriptionMaxLength} />
          </FieldRoot>
        )}
      />
      <MessageBox>
        <InformationLine />
        <Text>{t("myNdla.folder.sharedWarning")}</Text>
      </MessageBox>
      <ButtonRow>
        <DialogCloseTrigger asChild>
          <Button variant="secondary">{t("cancel")}</Button>
        </DialogCloseTrigger>
        <Button loading={loading} disabled={loading} type="submit" aria-label={loading ? t("loading") : undefined}>
          {t("save")}
        </Button>
      </ButtonRow>
    </StyledForm>
  );
};

export default FolderForm;
