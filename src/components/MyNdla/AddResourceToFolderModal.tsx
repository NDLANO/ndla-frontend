/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { gql } from '@apollo/client';
import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import { GQLAddResourceToFolderModal_ArticleFragment } from '../../graphqlTypes';
import AddResourceToFolder from './AddResourceToFolder';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  article: GQLAddResourceToFolderModal_ArticleFragment;
}
const AddResourceToFolderModal = ({ isOpen, onClose, article }: Props) => {
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
            <AddResourceToFolder article={article} />
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

AddResourceToFolderModal.fragments = {
  article: gql`
    fragment AddResourceToFolderModal_Article on Article {
      ...AddResourceToFolder_Article
    }
    ${AddResourceToFolder.fragments.article}
  `,
};

export default AddResourceToFolderModal;
