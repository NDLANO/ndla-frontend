/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ModalBody, ModalCloseButton, ModalHeader, ModalV2 } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import FolderForm from './FolderForm';
import { useUpdateFolderMutation } from '../folderMutations';

interface Props {
  folder?: GQLFolder;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const EditFolderModal = ({ folder, isOpen, onClose, onSaved }: Props) => {
  const { t } = useTranslation();

  const { updateFolder, loading } = useUpdateFolderMutation();

  return (
    <ModalV2
      controlled
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={'editHeading'}
    >
      {(onCloseModal) => (
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
              <FolderForm
                folder={folder}
                onSave={async (values) => {
                  await updateFolder({
                    variables: {
                      id: folder.id,
                      name: values.name,
                      description: values.description,
                    },
                  });
                  onSaved();
                  onCloseModal();
                }}
                onClose={onClose}
                loading={loading}
              />
            )}
          </ModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default EditFolderModal;
