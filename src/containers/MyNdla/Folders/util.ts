/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export const makeDndSortFunction = <PID, RES, T extends { id: string }>(
  parentId: PID,
  sortables: T[],
  sortFunction: (options: {
    variables: { sortedIds: string[]; parentId: PID };
  }) => Promise<RES>,
  updateCache: (newOrder: string[]) => void,
  setSortedFoldersState: (setNew: T[]) => void,
) => {
  return async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over === null) return;

    const originalIds = sortables.map(f => f.id);
    const oldIndex = originalIds.indexOf(active.id as string);
    const newIndex = originalIds.indexOf(over.id as string);

    if (newIndex === undefined || newIndex === oldIndex) return;

    const newSorted = arrayMove(sortables, oldIndex, newIndex);
    setSortedFoldersState(newSorted);

    const sortedIds = newSorted.map(f => f.id);

    // Update cache before sorting happens to make GUI feel snappy
    updateCache(sortedIds);

    return sortFunction({
      variables: {
        sortedIds,
        parentId,
      },
    }).catch(() => updateCache(originalIds));
  };
};
