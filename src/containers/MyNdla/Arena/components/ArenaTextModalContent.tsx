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
import ArenaForm, { ArenaFormValues } from './ArenaForm';
import { ButtonV2 } from '@ndla/button';
import { useCallback, useState } from 'react';
import { Pencil } from '@ndla/icons/action';
import { useUserAgent } from '../../../../UserAgentContext';
import { spacing } from '@ndla/core';
import { GQLArenaTopicFragmentFragment } from '../../../../graphqlTypes';

const StyledModalBody = styled(ModalBody)`
  display: flex;
  flex-direction: column;
`;

const StyledPencil = styled(Pencil)`
  width: ${spacing.snormal};
  height: ${spacing.snormal};
`;

interface Props {
  type: 'post' | 'reply';
  siblingTopics?: GQLArenaTopicFragmentFragment[];
}

const ArenaTextModal = ({ type, siblingTopics }: Props) => {
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

  return (
    <Modal open={open} onOpenChange={setOpen}>
      <ModalTrigger>
        {!!userAgent?.isMobile ? (
          <ButtonV2>
            {t('arena.topic.new', { type })}
            {type === 'post' && <StyledPencil />}
          </ButtonV2>
        ) : (
          <ButtonV2>{t('arena.topic.new', { type })}</ButtonV2>
        )}
      </ModalTrigger>
      <ArenaTextModalContent
        type={type}
        onClose={onModalClose}
        siblingTopics={siblingTopics ?? []}
      />
    </Modal>
  );
};

interface ContentProps {
  type: 'post' | 'reply';
  content?: string;
  title?: string;
  siblingTopics: GQLArenaTopicFragmentFragment[];
  onSave?: (data: ArenaFormValues) => Promise<void>;
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

export default ArenaTextModalContent;
