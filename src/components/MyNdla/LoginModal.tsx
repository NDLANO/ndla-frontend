/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useTranslation } from 'react-i18next';
import { ModalBody, ModalCloseButton, ModalHeader, ModalV2 } from '@ndla/modal';
import { ReactNode } from 'react';
import LoginComponent from './LoginComponent';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
}

const LoginModal = ({ isOpen, onClose, title, content }: Props) => {
  const { t } = useTranslation();

  return (
    <ModalV2
      controlled
      isOpen={isOpen}
      size="normal"
      onClose={onClose}
      label={t('user.modal.isNotAuth')}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <LoginComponent onClose={onClose} title={title} content={content} />
          </ModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default LoginModal;
