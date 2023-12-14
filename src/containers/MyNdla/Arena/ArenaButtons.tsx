/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner } from '@ndla/icons';
import { ArenaFormValues } from './components/ArenaForm';
import ArenaTextModal from './components/ArenaTextModal';
import { useCreateArenaTopic } from '../arenaMutations';
import { arenaCategoryQuery, useArenaCategory } from '../arenaQueries';

const toArenaTopic = (topicId: number | undefined) =>
  `/minndla/arena/topic/${topicId}`;

interface ArenaButtonsProps {
  inTopic?: boolean;
}

const ArenaButtons = ({ inTopic }: ArenaButtonsProps) => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const { loading, arenaCategory } = useArenaCategory({
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

  if (loading) {
    return <Spinner />;
  }

  const newPost = inTopic ? (
    <ArenaTextModal type="topic" onSave={createTopic} />
  ) : null;

  /* const newReply */

  const buttons = [newPost];

  return buttons;
};

export default memo(ArenaButtons);
