/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { useApolloClient } from '@apollo/client';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ndla/modal';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import {
  useUpdateFolderMutation,
  useFolders,
  getFolder,
} from '../folderMutations';
import FolderForm from './FolderForm';
import { buttonCss, iconCss } from './FoldersPage';

interface Props {
  folder?: GQLFolder;
  onSaved: () => void;
}

const FolderEditModal = ({ folder, onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2 css={buttonCss} variant="ghost" colorTheme="lighter">
          <Pencil css={iconCss} />
          {t('myNdla.folder.edit')}
        </ButtonV2>
      </ModalTrigger>
      <EditFolderModalContent
        folder={folder}
        onClose={() => setOpen(false)}
        onSaved={onSaved}
      />
    </Modal>
  );
};

export default FolderEditModal;

interface ContentProps {
  folder?: GQLFolder;
  onClose: () => void;
  onSaved: () => void;
}

export const EditFolderModalContent = ({
  folder,
  onClose,
  onSaved,
}: ContentProps) => {
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