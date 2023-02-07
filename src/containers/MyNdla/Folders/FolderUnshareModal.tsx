/**
 * Copyright (c) 2023-present, NDLA.
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
import { useUpdateFolderMutation } from '../folderMutations';
import { GQLFolder } from '../../../graphqlTypes';

const Title = styled.h1`
  margin-bottom: 0;
  ${fonts.sizes('30px')};
  ${mq.range({ until: breakpoints.tablet })} {
    ${fonts.sizes('20px')};
  }
`;

const StyledModalBody = styled(ModalBody)`
  h2 {
    margin: 0;
  }
`;

const StyledButtonRow = styled.div`
  display: flex;
  flex-direction: row;
`;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  content?: ReactNode;
  folder?: GQLFolder;
}

const FolderShareModal = ({
  isOpen,
  onClose,
  title,
  content,
  folder,
}: Props) => {
  const { t } = useTranslation();

  const { updateFolder, loading } = useUpdateFolderMutation();

  const handleUpdate = (status: 'shared' | 'private') => {
    if (folder) {
      updateFolder({ variables: { status, id: folder.id } });
    }
  };

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
              title={t('folder.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <StyledModalBody>
            Mappevisning
            {t(`folder.share.description.unshare`)}
            {content}
          </StyledModalBody>
        </>
      )}
    </ModalV2>
  );
};

export default FolderShareModal;
