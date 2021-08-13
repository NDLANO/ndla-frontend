import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { useTranslation } from 'react-i18next';

const MarginLeftParagraph = styled('p')`
  margin-left: 26px;
`;

const CodeWithBreakWord = styled('code')`
  word-break: break-word;
`;

const LtiEmbedCode = ({ onClose, code, isOpen }) => {
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
        <Fragment>
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
        </Fragment>
      )}
    </Modal>
  );
};

LtiEmbedCode.propTypes = {
  code: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LtiEmbedCode;
