/**
 * Copyright (c) 2023-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { memo } from 'react';
import styled from '@emotion/styled';
import { Plus } from '@ndla/icons/action';
import { ArenaFormValues } from './components/ArenaForm';
import ArenaTextModal from './components/ArenaTextModal';

const StyledListItem = styled.li`
  margin: 0;
`;

interface ArenaButtonsProps {
  key: string;
  type: 'topic' | 'post';
  onSave: (data: Partial<ArenaFormValues>) => Promise<void>;
}

const ArenaButtons = ({ key, type, onSave }: ArenaButtonsProps) => {
  const button = (
    <StyledListItem key={key}>
      <ArenaTextModal
        buttonIcon={<Plus />}
        onSave={onSave}
        toolbarTrigger
        type={type}
      />
    </StyledListItem>
  );
  return [button];
};

export default memo(ArenaButtons);
