/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ReactNode, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import { ButtonV2 } from '@ndla/button';
import { Pencil } from '@ndla/icons/action';
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
  Modal,
} from '@ndla/modal';
import ArenaForm, { ArenaFormValues } from './ArenaForm';
import { useUserAgent } from '../../../../UserAgentContext';
import { toolbarButtonCss } from '../../components/toolbarStyles';

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
  padding-top: 0px;
`;

const StyledPencil = styled(Pencil)`
  width: 20px;
  height: 20px;
`;

interface Props {
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  type: 'topic' | 'post';
  toolbarTrigger?: boolean;
  buttonIcon?: ReactNode;
}

const ArenaTextModal = ({
  buttonIcon,
  onSave,
  toolbarTrigger,
  type,
}: Props) => {
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
        {toolbarTrigger ? (
          <ButtonV2 css={toolbarButtonCss} variant="ghost" colorTheme="lighter">
            {buttonIcon && buttonIcon}
            {t(`myNdla.arena.new.${type}`)}
          </ButtonV2>
        ) : (
          <ButtonV2>
            {t(`myNdla.arena.new.${type}`)}
            {userAgent?.isMobile && type === 'topic' && <StyledPencil />}
          </ButtonV2>
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
