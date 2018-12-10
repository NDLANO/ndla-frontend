import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'react-emotion';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';

const MarginLeftParagraph = styled('p')`
  margin-left: 26px;
`;

const LtiEmbedCode = ({ onClose, code, isOpen, t }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="medium"
      width="20vw"
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
              <code>{code}</code>
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

export default injectT(LtiEmbedCode);
