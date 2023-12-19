/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Plus } from '@ndla/icons/action';
import { ArenaTextModalContent } from './components/ArenaTextModal';
import SettingsMenu, { MenuItemProps } from '../components/SettingsMenu';
import useArenaModal from '../useArenaModalActions';

interface ArenaActionsProps {
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
  topicId?: number;
}

const ArenaActions = ({ setFocusId, topicId }: ArenaActionsProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { createReply, createTopic } = useArenaModal({ setFocusId, topicId });

  const showNewPostButton = location.pathname.includes('category');
  const showNewReplyButton = location.pathname.includes('topic');

  const actionItems: MenuItemProps[] = useMemo(() => {
    const newPost: MenuItemProps = {
      icon: <Plus />,
      isModal: true,
      text: t('myNdla.arena.new.topic'),
      modalContent: (close) => (
        <ArenaTextModalContent
          onClose={close}
          onSave={createTopic}
          type="topic"
        />
      ),
    };
    const newReply: MenuItemProps = {
      icon: <Plus />,
      isModal: true,
      text: t(`myNdla.arena.new.post`),
      modalContent: (close) => (
        <ArenaTextModalContent
          onClose={close}
          onSave={createReply}
          type="post"
        />
      ),
    };

    if (showNewPostButton) {
      return [newPost];
    }

    if (showNewReplyButton) {
      return [newReply];
    }

    return [];
  }, [createReply, createTopic, showNewPostButton, showNewReplyButton, t]);

  return (
    <SettingsMenu menuItems={actionItems} modalHeader={t('myNdla.tools')} />
  );
};

export default ArenaActions;
