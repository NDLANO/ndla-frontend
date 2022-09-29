/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { DropResult } from 'react-beautiful-dnd';

/** Returns a shallow copy of `array` with element at `oldIdx` moved to `newIdx` */
export const moveIndexToNewIndex = <T>(
  array: T[],
  oldIdx: number,
  newIdx: number,
): T[] | null => {
  const copy = [...array];
  const toMove = copy[oldIdx];
  if (!toMove) return null;

  copy.splice(oldIdx, 1); // Remove moved item from list
  copy.splice(newIdx, 0, toMove); // Insert removed item to new location
  return copy;
};

export const makeDndSortFunction = <PID, RES>(
  parentId: PID,
  sortables: { id: string }[],
  sortFunction: (options: {
    variables: { sortedIds: string[]; parentId: PID };
  }) => Promise<RES>,
  updateCache: (newOrder: string[]) => void,
) => {
  return (dropResult: DropResult) => {
    const sourceIdx = dropResult.source.index;
    const destinationIdx = dropResult.destination?.index;
    if (destinationIdx === undefined) return;

    const originalIds = sortables.map(f => f.id);
    const sortedIds = moveIndexToNewIndex(
      originalIds,
      sourceIdx,
      destinationIdx,
    );
    if (sortedIds === null) return;

    // Update cache before sorting happens to make gui feel snappy
    updateCache(sortedIds);

    return sortFunction({
      variables: {
        sortedIds,
        parentId,
      },
    }).catch(() => updateCache(originalIds));
  };
};
