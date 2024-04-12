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
import { ButtonV2, LoadingButton } from "@ndla/button";
import { spacing } from "@ndla/core";
import { FieldErrorMessage, FormControl, InputV3, Label, TextAreaV3 } from "@ndla/forms";
import { ModalCloseButton } from "@ndla/modal";
import { GQLFolder } from "../../../graphqlTypes";
import useValidationTranslation from "../../../util/useValidationTranslation";

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
          <FormControl id="name" isInvalid={!!fieldState.error?.message}>
            <Label textStyle="label-small" margin="none">
              {t("validation.fields.name")}
            </Label>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <InputV3 {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={nameMaxLength} />
          </FormControl>
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
          <FormControl id="description" isInvalid={!!fieldState.error?.message}>
            <Label textStyle="label-small" margin="none">
              {t("validation.fields.description")}
            </Label>
            <FieldErrorMessage>{fieldState.error?.message}</FieldErrorMessage>
            <TextAreaV3 {...field} />
            <FieldLength value={field.value?.length ?? 0} maxLength={descriptionMaxLength} />
          </FormControl>
        )}
      />
      <StyledParagraph>{t("myNdla.folder.sharedWarning")}</StyledParagraph>
      <ButtonRow>
        <ModalCloseButton>
          <ButtonV2 variant="outline">{t("cancel")}</ButtonV2>
        </ModalCloseButton>
        <LoadingButton colorTheme="primary" loading={loading} type="submit" disabled={loading}>
          {t("save")}
        </LoadingButton>
      </ButtonRow>
    </StyledForm>
  );
};

interface FieldLengthProps {
  value: number;
  maxLength: number;
}

const StyledSpan = styled.span`
  display: block;
  text-align: right;
`;
// TODO Update component to be more UU friendly
export const FieldLength = ({ value, maxLength }: FieldLengthProps) => {
  return <StyledSpan>{`${value}/${maxLength}`}</StyledSpan>;
};

export default FolderForm;
