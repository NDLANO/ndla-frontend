import React from 'react';
import styled from '@emotion/styled';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { useTranslation } from 'react-i18next';

const MarginLeftParagraph = styled('p')`
  margin-left: 26px;
`;

const CodeWithBreakWord = styled('code')`
  word-break: break-word;
`;

interface Props {
  code: string;
  isOpen: boolean;
  onClose: () => void;
}
const LtiEmbedCode = ({ onClose, code, isOpen }: Props) => {
  const { t } = useTranslation();
  if (!isOpen) {
    return null;
  }
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
            <MarginLeftParagraph>{t('lti.notSupported')}</MarginLeftParagraph>
            <pre>
              <CodeWithBreakWord>{code}</CodeWithBreakWord>
            </pre>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default LtiEmbedCode;
