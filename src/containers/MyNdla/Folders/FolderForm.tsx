/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
import { ButtonV2, LoadingButton } from '@ndla/button';
import { InputV2, TextAreaV2 } from '@ndla/forms';
import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { GQLFolder } from '../../../graphqlTypes';
import useValidationTranslation from '../../../util/useValidationTranslation';
import { useFolders, getFolder } from '../folderMutations';

interface EditFolderFormProps {
  folder?: GQLFolder;
  onSave: (values: FolderFormValues) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  margin-top: ${spacing.large};
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.normal};
`;

const StyledParagraph = styled.p`
  margin: 0;
`;

export interface FolderFormValues {
  name: string;
  description?: string;
}

const toFormValues = (folder: GQLFolder | undefined): FolderFormValues => {
  return {
    name: folder?.name ?? '',
    description: folder?.description,
  };
};

const descriptionMaxLength = 200;
const nameMaxLength = 64;

const FolderForm = ({
  folder,
  onSave,
  onClose,
  loading,
}: EditFolderFormProps) => {
  const { t } = useTranslation();
  const { t: validationT } = useValidationTranslation();
  const {
    control,
    trigger,
    handleSubmit,
    formState: { isValid, isDirty, errors },
  } = useForm({
    defaultValues: toFormValues(folder),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  // Validate on mount.
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { cache } = useApolloClient();

  const { folders } = useFolders();

  const levelFolders = useMemo(
    () =>
      folder?.parentId
        ? getFolder(cache, folder.parentId)?.subfolders ?? []
        : folders,
    [cache, folder?.parentId, folders],
  );

  const siblings = levelFolders.filter((f) => f.id !== folder?.id);

  const onSubmit = (values: FolderFormValues) => onSave(values);
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        rules={{
          required: validationT({ type: 'required', field: 'name' }),
          maxLength: {
            value: nameMaxLength,
            message: validationT({
              type: 'maxLength',
              field: 'name',
              vars: { count: nameMaxLength },
            }),
          },
          validate: (name) => {
            const exists = siblings.every(
              (f) => f.name.toLowerCase() !== name.toLowerCase(),
            );
            if (!exists) {
              return validationT('validation.notUnique');
            }
            return true;
          },
        }}
        render={({ field }) => (
          <div>
            <InputV2
              label="Navn"
              error={errors.name?.message}
              maxLength={nameMaxLength}
              id="name"
              required
              {...field}
            />
            <FieldLength
              value={field.value?.length ?? 0}
              maxLength={nameMaxLength}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="description"
        rules={{
          maxLength: {
            value: descriptionMaxLength,
            message: validationT({
              type: 'maxLength',
              field: 'description',
              vars: { count: descriptionMaxLength },
            }),
          },
        }}
        render={({ field }) => (
          <div>
            <TextAreaV2
              label="Beskrivelse"
              error={errors.description?.message}
              id="description"
              maxLength={descriptionMaxLength}
              {...field}
            />
            <FieldLength
              value={field.value?.length ?? 0}
              maxLength={descriptionMaxLength}
            />
          </div>
        )}
      />
      <StyledParagraph>{t('myNdla.folder.sharedWarning')}</StyledParagraph>

      <ButtonRow>
        <ButtonV2 variant="outline" onClick={onClose}>
          {t('cancel')}
        </ButtonV2>
        <LoadingButton
          loading={loading}
          type="submit"
          disabled={!isValid || !isDirty || loading}
        >
          {t('save')}
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

const FieldLength = ({ value, maxLength }: FieldLengthProps) => {
  return <StyledSpan>{`${value}/${maxLength}`}</StyledSpan>;
};

export default FolderForm;
