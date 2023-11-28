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
import { GQLArenaTopicFragmentFragment } from '../../../../graphqlTypes';
import ArenaForm, { ArenaFormValues } from './ArenaForm';

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
`;

const StyledPencil = styled(Pencil)`
  width: ${spacing.snormal};
  height: ${spacing.snormal};
`;

interface Props {
  type: 'topic' | 'post';
  siblingTopics?: GQLArenaTopicFragmentFragment[];
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
}

const ArenaTextModal = ({ type, siblingTopics, onSave }: Props) => {
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
    async (data: Partial<ArenaFormValues>) => {
      await onSave(data);
      setCreated(true);
      onModalClose();
    },
    [setCreated, onSave],
  );

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        {userAgent?.isMobile ? (
          <ButtonV2>
            {t('arena.topic.new', { type })}
            {type === 'topic' && <StyledPencil />}
          </ButtonV2>
        ) : (
          <ButtonV2>{t('arena.topic.new', { type })}</ButtonV2>
        )}
      </ModalTrigger>
      <ArenaTextModalContent
        type={type}
        onClose={onModalClose}
        siblingTopics={siblingTopics ?? []}
        onSave={onCreate}
      />
    </Modal>
  );
};

interface ContentProps {
  type: 'topic' | 'post';
  content?: string;
  title?: string;
  siblingTopics: GQLArenaTopicFragmentFragment[];
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
  onClose: () => void;
}

const ArenaTextModalContent = ({
  type,
  title,
  content,
  siblingTopics,
  onSave,
  onClose,
}: ContentProps) => {
  const { t } = useTranslation();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{t('arena.topic.new', { type })}</ModalTitle>
        <ModalCloseButton />
      </ModalHeader>
      <StyledModalBody>
        <ArenaForm
          title={title}
          content={content}
          onSave={async (data: ArenaFormValues) => {
            await onSave?.(data);
            onClose();
          }}
          type={type}
          siblingTopics={siblingTopics}
        />
      </StyledModalBody>
    </ModalContent>
  );
};

export default ArenaTextModal;
