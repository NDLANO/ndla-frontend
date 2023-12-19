/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Dispatch, memo, SetStateAction } from 'react';
import { useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { Plus } from '@ndla/icons/action';
import ArenaTextModal from './components/ArenaTextModal';
import useArenaModal from '../useArenaModalActions';

const StyledListItem = styled.li`
  margin: 0;
`;

interface ArenaButtonsProps {
  setFocusId?: Dispatch<SetStateAction<number | undefined>>;
  topicId?: number;
}

const ArenaButtons = ({ setFocusId, topicId }: ArenaButtonsProps) => {
  const location = useLocation();
  const { createReply, createTopic } = useArenaModal({ setFocusId, topicId });

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
