/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import LoginComponent from './LoginComponent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const StyledModal = styled(Modal)`
  && h2 {
    margin: 0;
  }
`;

const LoginModal = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <StyledModal
      controllable
      isOpen={isOpen}
      size="regular"
      backgroundColor="white"
      onClose={onClose}
      label={t('user.modal.isNotAuth')}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <ModalCloseButton
              onMouseDown={e => {
                e.preventDefault();
              }}
              onMouseUp={e => {
                e.preventDefault();
              }}
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <LoginComponent onClose={onClose} />
          </ModalBody>
        </>
      )}
    </StyledModal>
  );
};

export default LoginModal;
