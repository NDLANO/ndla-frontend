/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Plus } from '@ndla/icons/action';
import { ArenaFormValues } from './components/ArenaForm';
import { ArenaTextModalContent } from './components/ArenaTextModal';
import { useCreateArenaTopic, useReplyToTopic } from '../arenaMutations';
import {
  arenaCategoryQuery,
  arenaTopicById,
  useArenaCategory,
} from '../arenaQueries';
import SettingsMenu, { MenuItemProps } from '../components/SettingsMenu';

const toArenaTopic = (topicId: number | undefined) =>
  `/minndla/arena/topic/${topicId}`;

interface ArenaActionsProps {
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
  topicId?: number;
}

const ArenaActions = ({ setFocusId, topicId }: ArenaActionsProps) => {
  const { t } = useTranslation();
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { replyToTopic } = useReplyToTopic({
    refetchQueries: [
      {
        query: arenaTopicById,
        variables: { topicId, page: 1 },
      },
    ],
  });

  const { arenaCategory } = useArenaCategory({
    variables: { categoryId: Number(categoryId), page: 1 },
    skip: !Number(categoryId),
  });

  const { createArenaTopic } = useCreateArenaTopic({
    refetchQueries: [
      {
        query: arenaCategoryQuery,
        variables: { categoryId: arenaCategory?.id, page: 1 },
      },
    ],
  });

  const createReply = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      const newReply = await replyToTopic({
        variables: { topicId: Number(topicId), content: data.content ?? '' },
      });
      setFocusId?.(newReply.data?.replyToTopic.id);
    },
    [replyToTopic, topicId, setFocusId],
  );

  const createTopic = useCallback(
    async (data: Partial<ArenaFormValues>) => {
      if (arenaCategory) {
        const topic = await createArenaTopic({
          variables: {
            content: data.content ?? '',
            title: data.title ?? '',
            categoryId: arenaCategory?.id,
          },
        });
        navigate(toArenaTopic(topic.data?.newArenaTopic?.id));
      }
    },
    [arenaCategory, createArenaTopic, navigate],
  );

  const showNewPostButton = location.pathname.includes('category');
  const showNewReplyButton = location.pathname.includes('topic');

  const actionItems: MenuItemProps[] = useMemo(() => {
    const newPost: MenuItemProps = {
      icon: <Plus />,
      isModal: true,
      text: t(`myNdla.arena.new.topic`),
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
