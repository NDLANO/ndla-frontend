/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { spacing } from '@ndla/core';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
  loading?: boolean;
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
  removeText,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="regular"
      backgroundColor="white"
      onClose={onClose}
      labelledBy={'deleteTitle'}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <h1 id="deleteTitle">{title}</h1>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <p>{description}</p>
            <StyledButtonRow>
              <ButtonV2 variant="outline" onClick={onCloseModal}>
                {t('cancel')}
              </ButtonV2>
              <ButtonV2 colorTheme="danger" onClick={onDelete}>
                {removeText}
              </ButtonV2>
            </StyledButtonRow>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default DeleteModal;
