import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader, ModalBody, ModalCloseButton } from '@ndla/modal';
import { injectT } from '@ndla/i18n';

const LtiEmbedCode = ({ onClose, code, isOpen, t }) => {
  if (!isOpen) {
    return null;
  }
  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="small"
      backgroundColor="white"
      onClose={onClose}>
      {onCloseModal => (
        <Fragment>
          <ModalHeader>
            <ModalCloseButton title={t('modal.close')} onClick={onCloseModal} />
          </ModalHeader>
          <ModalBody>
            <p>
              Det fungerte ikke å sette inn innholdet automatisk. Du kan kopiere
              kildekoden under i ditt innhold.
            </p>
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
