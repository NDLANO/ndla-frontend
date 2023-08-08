/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
  ModalContent,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useApolloClient } from '@apollo/client';
import { GQLFolder } from '../../../graphqlTypes';
import FolderForm from './FolderForm';
import {
  getFolder,
  useFolders,
  useUpdateFolderMutation,
} from '../folderMutations';

interface Props {
  folder?: GQLFolder;
  onClose: () => void;
  onSaved: () => void;
}

const EditFolderModalContent = ({ folder, onClose, onSaved }: Props) => {
  const { t } = useTranslation();

  const { updateFolder, loading } = useUpdateFolderMutation();

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

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t('myNdla.folder.edit')}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        {folder && (
          <FolderForm
            folder={folder}
            siblings={siblings}
            onSave={async (values) => {
              await updateFolder({
                variables: {
                  id: folder.id,
                  name: values.name,
                  description: values.description,
                },
              });
              onSaved();
              onClose();
            }}
            loading={loading}
          />
        )}
      </ModalBody>
    </ModalContent>
  );
};

export default EditFolderModalContent;
