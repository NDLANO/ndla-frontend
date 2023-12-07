/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Modal,
} from '@ndla/modal';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { useCallback, useState } from 'react';
import { Pencil } from '@ndla/icons/action';
import { spacing } from '@ndla/core';
import { useUserAgent } from '../../../../UserAgentContext';
import ArenaForm, { ArenaFormValues } from './ArenaForm';

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  padding-top: 0px;
`;

const StyledPencil = styled(Pencil)`
  width: ${spacing.snormal};
  height: ${spacing.snormal};
`;

interface Props {
  type: 'topic' | 'post';
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
}

const ArenaTextModal = ({ type, onSave }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [created, setCreated] = useState(false);
  const userAgent = useUserAgent();

  const onModalClose = useCallback(
    (e?: Event) => {
      if (created) {
        e?.preventDefault();
        setCreated(false);
      }
    },
    [created],
  );

  const onCreate = useCallback(
    async (data: Partial<ArenaFormValues> | ArenaFormValues) => {
      setCreated(true);
      setOpen(false);
      await onSave(data);
    },
    [setCreated, onSave, setOpen],
  );

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        {userAgent?.isMobile ? (
          <ButtonV2>
            {t(`myNdla.arena.new.${type}`)}
            {type === 'topic' && <StyledPencil />}
          </ButtonV2>
        ) : (
          <ButtonV2>{t(`myNdla.arena.new.${type}`)}</ButtonV2>
        )}
      </ModalTrigger>
      <ArenaTextModalContent
        type={type}
        onClose={onModalClose}
        onSave={onCreate}
      />
    </Modal>
  );
};

interface ContentProps {
  type: 'topic' | 'post';
  content?: string;
  title?: string;
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  onClose: () => void;
}

export const ArenaTextModalContent = ({
  type,
  title,
  content,
  onSave,
  onClose,
}: ContentProps) => {
  const { t } = useTranslation();
  return (
    <ModalContent onCloseAutoFocus={onClose}>
      <ModalHeader>
        <ModalTitle>{t(`myNdla.arena.new.${type}`)}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <StyledModalBody>
        <ArenaForm
          initialTitle={title}
          initialContent={content}
          onSave={async (data: Partial<ArenaFormValues>) => {
            await onSave(data);
            onClose();
          }}
          type={type}
        />
      </StyledModalBody>
    </ModalContent>
  );
};

export default ArenaTextModal;
