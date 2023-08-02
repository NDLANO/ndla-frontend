/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2, LoadingButton } from '@ndla/button';
import { InputV2, TextAreaV2 } from '@ndla/forms';
import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { spacing } from '@ndla/core';
import { ModalCloseButton } from '@ndla/modal';
import config from '../../../config';
import { GQLFolder } from '../../../graphqlTypes';
import useValidationTranslation from '../../../util/useValidationTranslation';

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

const descriptionMaxLength = 300;
const nameMaxLength = 64;

const FolderForm = ({
  folder,
  onSave,
  siblings,
  loading,
}: EditFolderFormProps) => {
  const { t } = useTranslation();
  const { validationT } = useValidationTranslation();
  const {
    control,
    trigger,
    handleSubmit,
    getValues,
    setValue,
    formState: { isValid, isDirty, errors },
  } = useForm({
    defaultValues: toFormValues(folder),
    reValidateMode: 'onChange',
    mode: 'all',
  });

  useEffect(() => {
    if (!getValues().description) {
      setValue('description', t('myNdla.sharedFolder.description.all'), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  // Validate on mount.
  useEffect(() => {
    trigger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              label={t('validation.fields.name')}
              error={errors.name?.message}
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
      {config.folderDescriptionEnabled && (
        <>
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
                  label={t('validation.fields.description')}
                  error={errors.description?.message}
                  id="description"
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
        </>
      )}

      <ButtonRow>
        <ModalCloseButton>
          <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
        </ModalCloseButton>
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
