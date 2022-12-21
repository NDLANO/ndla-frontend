/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import styled from '@emotion/styled';
import { LoadingButton, ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import { InputV2 } from '@ndla/forms';
import { GQLFolder } from '../../../graphqlTypes';
import { getFolder, useFolders } from '../folderMutations';
import useValidationTranslation from '../../../util/useValidationTranslation';

interface Props {
  folder?: GQLFolder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string, folder: GQLFolder) => Promise<void>;
  loading?: boolean;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  margin-top: ${spacing.large};
`;

interface FormValues {
  name: string;
}

const toFormValues = (folder: GQLFolder): FormValues => {
  return {
    name: folder.name,
  };
};

const EditFolderModal = ({
  folder,
  isOpen,
  onClose,
  onSave,
  loading,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="regular"
      backgroundColor="white"
      onClose={onClose}
      labelledBy={'editHeading'}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <h1 id="editHeading">{t('myNdla.folder.edit')}</h1>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            {folder && (
              <EditFolderForm
                folder={folder}
                onSave={onSave}
                onClose={onClose}
                loading={loading}
              />
            )}
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

interface EditFolderFormProps {
  folder: GQLFolder;
  onSave: (name: string, folder: GQLFolder) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

const EditFolderForm = ({
  folder,
  onSave,
  onClose,
  loading,
}: EditFolderFormProps) => {
  const { t } = useTranslation();
  const { t: validationT } = useValidationTranslation();
  const {
    register,
    handleSubmit,
    formState: { isValid, isDirty, errors },
  } = useForm({
    defaultValues: toFormValues(folder),
    reValidateMode: 'onChange',
    mode: 'onChange',
  });

  const { cache } = useApolloClient();

  const { folders } = useFolders();

  const levelFolders = folder.parentId
    ? getFolder(cache, folder.parentId)?.subfolders ?? []
    : folders;

  const siblings = levelFolders.filter(f => f.id !== folder.id);

  const onSubmit = (values: FormValues) => onSave(values.name, folder);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <InputV2
        label="Navn"
        {...register('name', {
          required: validationT({ type: 'required', field: 'name' }),
          maxLength: {
            value: 64,
            message: validationT({
              type: 'maxLength',
              field: 'name',
              vars: { count: 64 },
            }),
          },
          validate: name => {
            const exists = siblings.every(
              f => f.name.toLowerCase() !== name.toLowerCase(),
            );
            if (!exists) {
              return validationT('validation.notUnique');
            }
            return true;
          },
        })}
        error={errors.name?.message}
        id="name"
        required
      />
      <ButtonRow>
        <ButtonV2 variant="outline" onClick={onClose}>
          {t('cancel')}
        </ButtonV2>
        <LoadingButton
          loading={loading}
          type="submit"
          disabled={!isValid || !isDirty || loading}>
          {t('save')}
        </LoadingButton>
      </ButtonRow>
    </form>
  );
};

export default EditFolderModal;
