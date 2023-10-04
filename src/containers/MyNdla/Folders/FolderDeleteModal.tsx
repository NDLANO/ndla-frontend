/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { TrashCanOutline } from '@ndla/icons/action';
import { Modal, ModalTrigger } from '@ndla/modal';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteModalContent from '../components/DeleteModalContent';

interface Props {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
}

const FolderDeleteModal = ({
  onDelete,
  title,
  description,
  removeText,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2 variant="ghost" colorTheme="lighter">
          <TrashCanOutline />
          {t('myNdla.folder.delete')}
        </ButtonV2>
      </ModalTrigger>
      <DeleteModalContent
        onDelete={async () => {
          onDelete();
          close();
        }}
        title={title}
        description={description}
        removeText={removeText}
      />
    </Modal>
  );
};

export default FolderDeleteModal;
