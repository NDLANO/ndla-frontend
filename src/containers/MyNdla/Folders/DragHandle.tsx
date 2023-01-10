/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useSortable } from '@dnd-kit/sortable';
import styled from '@emotion/styled';
import { IconButtonV2 } from '@ndla/button';
import { DragVertical } from '@ndla/icons/editor';
import { spacing } from '@ndla/core';

interface Props extends HTMLProps<HTMLButtonElement> {
  sortableId: string;
  type: 'folder' | 'resource';
  name: string;
}

const StyledDragHandle = styled(IconButtonV2)`
  touch-action: manipulation;
  position: absolute;
  left: -${spacing.xxsmall};
  transform: translateX(-100%);
  :disabled {
    display: none;
  }
`;

const DragHandle = ({ sortableId, type, name, ...rest }: Props) => {
  const { t } = useTranslation();
  const { listeners, setActivatorNodeRef } = useSortable({ id: sortableId });
  return (
    <StyledDragHandle
      {...rest}
      aria-label={t(`myNdla.${type}.dragHandle`, { name })}
      type={'button'}
      variant={'ghost'}
      colorTheme={'light'}
      size={'small'}
      tabIndex={0}
      {...listeners}
      ref={setActivatorNodeRef}>
      <DragVertical />
    </StyledDragHandle>
  );
};

export default DragHandle;
