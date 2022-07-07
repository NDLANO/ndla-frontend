/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import AddResourceToFolder, { ResourceAttributes } from './AddResourceToFolder';

interface Props {
  resource: ResourceAttributes;
  resourceComponent: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
const AddResourceToFolderModal = ({
  isOpen,
  onClose,
  resource,
  resourceComponent,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="medium"
      backgroundColor="white"
      onClose={onClose}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <AddResourceToFolder
              resource={resource}
              resourceComponent={resourceComponent}
              onClose={onClose}
            />
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default AddResourceToFolderModal;
