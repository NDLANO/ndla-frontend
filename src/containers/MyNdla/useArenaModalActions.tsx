/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, SetStateAction, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArenaFormValues } from './Arena/components/ArenaForm';
import { useCreateArenaTopic, useReplyToTopic } from './arenaMutations';
import {
  arenaTopicById,
  useArenaCategory,
  arenaCategoryQuery,
} from './arenaQueries';

const toArenaTopic = (topicId: number | undefined) =>
  `/minndla/arena/topic/${topicId}`;

interface ArenaModalProps {
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
  topicId?: number;
}

const useArenaModal = ({ setFocusId, topicId }: ArenaModalProps) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

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
  const { replyToTopic } = useReplyToTopic({
    refetchQueries: [
      {
        query: arenaTopicById,
        variables: { topicId, page: 1 },
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

  return { createReply, createTopic };
};

export default useArenaModal;
