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
import styled from "@emotion/styled";
import { spacing } from "@ndla/core";
import { ModalCloseButton } from "@ndla/modal";
import { Button, FieldErrorMessage, FieldInput, FieldLabel, FieldRoot } from "@ndla/primitives";
import { GQLFolder } from "../../../../graphqlTypes";
import useValidationTranslation from "../../../../util/useValidationTranslation";
import FieldLength from "../../components/FieldLength";

interface EditFolderFormProps {
  folder?: GQLFolder;
  onSave: (values: FolderFormValues) => Promise<void>;
  siblings: GQLFolder[];
  loading?: boolean;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  margin-top: ${spacing.small};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.small};
`;

const StyledParagraph = styled.p`
  margin: 0;
`;

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
            <FieldLabel>{t("validation.fields.name")}</FieldLabel>
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
            <FieldInput {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={descriptionMaxLength} />
          </FieldRoot>
        )}
      />
      <StyledParagraph>{t("myNdla.folder.sharedWarning")}</StyledParagraph>
      <ButtonRow>
        <ModalCloseButton>
          <Button variant="secondary">{t("cancel")}</Button>
        </ModalCloseButton>
        <Button loading={loading} type="submit" aria-live="polite" aria-label={loading ? t("loading") : ""}>
          {t("save")}
        </Button>
      </ButtonRow>
    </StyledForm>
  );
};

export default FolderForm;
