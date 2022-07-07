/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import Button, { DeleteButton } from '@ndla/button';
import { spacing } from '@ndla/core';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description: string;
}

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

const DeleteModal = ({
  isOpen,
  onClose,
  onDelete,
  title,
  description,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="regular"
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
            <h1>{title}</h1>
            <p>{description}</p>
            <StyledButtonRow>
              <Button outline onClick={onCloseModal}>
                {t('myNdla.folder.cancel')}
              </Button>
              <DeleteButton onClick={onDelete}>
                {t('myNdla.folder.delete')}
              </DeleteButton>
            </StyledButtonRow>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default DeleteModal;
