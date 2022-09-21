/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import AddResourceToFolder, { ResourceAttributes } from './AddResourceToFolder';
import { AuthContext } from '../AuthenticationContext';
import LoginComponent from './LoginComponent';
import { useFolderResourceMeta } from '../../containers/MyNdla/folderMutations';

interface Props {
  resource: ResourceAttributes;
  isOpen: boolean;
  onClose: () => void;
}

const StyledModal = styled(Modal)`
  && h2 {
    margin: 0;
  }
`;

const AddResourceToFolderModal = ({ isOpen, onClose, resource }: Props) => {
  const { t } = useTranslation();
  const { authenticated } = useContext(AuthContext);
  const { meta } = useFolderResourceMeta(resource, { skip: !resource });

  return (
    <StyledModal
      controllable
      isOpen={isOpen}
      size="regular"
      backgroundColor="white"
      onClose={onClose}
      label={
        authenticated
          ? t('myNdla.resource.addToMyNdla')
          : t('user.modal.isNotAuth')
      }>
      {onCloseModal => (
        <>
          <ModalHeader>
            {authenticated && <h1>{t('myNdla.resource.addToMyNdla')}</h1>}
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            {authenticated ? (
              <AddResourceToFolder resource={resource} onClose={onClose} />
            ) : (
              <LoginComponent
                resource={resource}
                meta={meta}
                onClose={onClose}
              />
            )}
          </ModalBody>
        </>
      )}
    </StyledModal>
  );
};

export default AddResourceToFolderModal;
