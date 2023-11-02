/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { TrashCanOutline } from '@ndla/icons/action';
import { Modal, ModalTrigger } from '@ndla/modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteModalContent from '../components/DeleteModalContent';
import { buttonCss, iconCss } from './FoldersPage';

interface Props {
  onDelete: () => void;
  onClose: (e?: Event) => void;
}

const FolderDeleteModal = ({ onDelete, onClose }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2 css={buttonCss} variant="ghost" colorTheme="danger">
          <TrashCanOutline css={iconCss} />
          {t('myNdla.folder.delete')}
        </ButtonV2>
      </ModalTrigger>
      <DeleteModalContent
        onClose={onClose}
        onDelete={async () => {
          onDelete();
          setOpen(false);
          onClose();
        }}
        title={t('myNdla.folder.delete')}
        description={t('myNdla.confirmDeleteFolder')}
        removeText={t('myNdla.folder.delete')}
      />
    </Modal>
  );
};

export default FolderDeleteModal;
