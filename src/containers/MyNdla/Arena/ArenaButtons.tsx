/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, memo, SetStateAction, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Spinner } from '@ndla/icons';
import { Plus } from '@ndla/icons/action';
import { ArenaFormValues } from './components/ArenaForm';
import ArenaTextModal from './components/ArenaTextModal';
import { useCreateArenaTopic, useReplyToTopic } from '../arenaMutations';
import {
  arenaCategoryQuery,
  arenaTopicById,
  useArenaCategory,
} from '../arenaQueries';

const toArenaTopic = (topicId: number | undefined) =>
  `/minndla/arena/topic/${topicId}`;

const StyledListItem = styled.li`
  margin: 0;
`;

interface ArenaButtonsProps {
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
  topicId?: number;
}

const ArenaButtons = ({ setFocusId, topicId }: ArenaButtonsProps) => {
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

  if (loading) {
    return <Spinner />;
  }

  const showNewPostButton = location.pathname.includes('category');
  const showNewReplyButton = location.pathname.includes('topic');

  const newPost = showNewPostButton ? (
    <StyledListItem key="newTopic">
      <ArenaTextModal
        buttonIcon={<Plus />}
        onSave={createTopic}
        toolbarTrigger
        type="topic"
      />
    </StyledListItem>
  ) : null;

  const newReply = showNewReplyButton ? (
    <StyledListItem key="newReply">
      <ArenaTextModal
        buttonIcon={<Plus />}
        onSave={createReply}
        toolbarTrigger
        type="post"
      />
    </StyledListItem>
  ) : null;

  const buttons = [newPost, newReply];

  return buttons;
};

export default memo(ArenaButtons);
