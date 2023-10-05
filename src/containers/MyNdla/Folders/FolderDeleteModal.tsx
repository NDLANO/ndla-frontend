/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ButtonV2 } from '@ndla/button';
import { TrashCanOutline } from '@ndla/icons/action';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from '@ndla/modal';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { spacing } from '@ndla/core';

interface Props {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
}

const FolderDeleteModal = ({
  onDelete,
  title,
  description,
  removeText,
}: Props) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const close = useCallback(() => setOpen(false), []);

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        <ButtonV2 variant="ghost" colorTheme="lighter">
          <TrashCanOutline />
          {t('myNdla.folder.delete')}
        </ButtonV2>
      </ModalTrigger>
      <DeleteModalContent
        onDelete={async () => {
          onDelete();
          close();
        }}
        title={title}
        description={description}
        removeText={removeText}
      />
    </Modal>
  );
};

export default FolderDeleteModal;

interface ContentProps {
  onDelete: () => void;
  title: string;
  description: string;
  removeText: string;
}

const StyledButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
`;

export const DeleteModalContent = ({
  onDelete,
  title,
  description,
  removeText,
}: ContentProps) => {
  const { t } = useTranslation();
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <p>{description}</p>
        <StyledButtonRow>
          <ModalCloseButton>
            <ButtonV2 variant="outline">{t('cancel')}</ButtonV2>
          </ModalCloseButton>
          <ButtonV2 colorTheme="danger" variant="outline" onClick={onDelete}>
            {removeText}
          </ButtonV2>
        </StyledButtonRow>
      </ModalBody>
    </ModalContent>
  );
};
