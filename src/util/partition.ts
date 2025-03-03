/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const partition = <T>(array: T[] | undefined, predicate: (value: T) => boolean): [T[], T[]] => {
  if (!array) return [[], []];
  return array.reduce<[T[], T[]]>(
    (acc, curr) => {
      if (predicate(curr)) {
        acc[0].push(curr);
      } else {
        acc[1].push(curr);
      }
      return acc;
    },
    [[], []],
  );
};
