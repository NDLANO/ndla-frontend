/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { useSortable } from '@dnd-kit/sortable';
import { IconButtonV2 } from '@ndla/button';
import { DragVertical } from '@ndla/icons/editor';
import { useTranslation } from 'react-i18next';

interface Props {
  sortableId: string;
}

export const DragHandle = ({ sortableId }: Props) => {
  const { t } = useTranslation();
  const { listeners, setActivatorNodeRef } = useSortable({ id: sortableId });
  return (
    <div {...listeners} ref={setActivatorNodeRef}>
      <IconButtonV2
        aria-label={t('myNdla.dragHandleLabel')}
        type={'button'}
        variant={'ghost'}
        colorTheme={'light'}
        size={'small'}>
        <DragVertical />
      </IconButtonV2>
    </div>
  );
};
