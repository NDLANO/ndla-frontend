/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import Modal, { ModalBody, ModalCloseButton, ModalHeader } from '@ndla/modal';
import { Input } from '@ndla/forms';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@ndla/button';
import { spacing } from '@ndla/core';
import { GQLFolder } from '../../../graphqlTypes';

interface Props {
  folder: GQLFolder;
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
}

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing.small};
  margin-top: ${spacing.large};
`;

const EditFolderModal = ({ folder, isOpen, onClose, onSave }: Props) => {
  const { t } = useTranslation();
  const [value, setValue] = useState(folder.name);
  const disabled = value === folder.name || value.trim().length === 0;
  return (
    <Modal
      controllable
      isOpen={isOpen}
      size="regular"
      backgroundColor="white"
      onClose={onClose}
      label={t('myNdla.folder.edit')}>
      {onCloseModal => (
        <>
          <ModalHeader>
            <ModalCloseButton
              title={t('modal.closeModal')}
              onClick={onCloseModal}
            />
          </ModalHeader>
          <ModalBody>
            <h1>{t('myNdla.folder.edit')}</h1>
            <Input
              label={t('title')}
              warningText={
                value.trim().length === 0
                  ? t('myNdla.folder.missingName')
                  : undefined
              }
              value={value}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  onSave(value);
                }
              }}
              onInput={e => setValue(e.currentTarget.value)}
              autoFocus
            />
            <ButtonRow>
              <Button outline onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button disabled={disabled} onClick={() => onSave(value)}>
                {t('save')}
              </Button>
            </ButtonRow>
          </ModalBody>
        </>
      )}
    </Modal>
  );
};

export default EditFolderModal;
