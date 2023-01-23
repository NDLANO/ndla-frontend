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
import styled from '@emotion/styled';
import { breakpoints, fonts, mq } from '@ndla/core';
import LoginComponent from './LoginComponent';

const Title = styled.h1`
  margin-bottom: 0;
  ${fonts.sizes('30px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px')};
  }
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
}

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0;
  }
`;

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
            <Title>{title}</Title>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <StyledModalBody>
            <LoginComponent onClose={onClose} content={content} />
          </StyledModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default LoginModal;
