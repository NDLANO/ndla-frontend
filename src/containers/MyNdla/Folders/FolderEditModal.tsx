/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import { Modal, ModalTrigger } from '@ndla/modal';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GQLFolder } from '../../../graphqlTypes';
import EditFolderModalContent from './EditFolderModalContent';

interface Props {
  folder?: GQLFolder;
  onSaved: () => void;
}

const FolderEditModal = ({ folder, onSaved }: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2 variant="ghost" colorTheme="lighter">
          <Pencil />
          {t('myNdla.folder.edit')}
        </ButtonV2>
      </ModalTrigger>
      <EditFolderModalContent
        folder={folder}
        onClose={close}
        onSaved={onSaved}
      />
    </Modal>
  );
};

export default FolderEditModal;
