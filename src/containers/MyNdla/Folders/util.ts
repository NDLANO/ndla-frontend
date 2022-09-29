/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

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
