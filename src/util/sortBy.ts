/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const sortBy = <T>(array: T[] | undefined, key: (val: T) => string | number | undefined): T[] => {
  if (!array) return [];
  return [...array].sort((a, b) => {
    const keyA = key(a) ?? -Infinity;
    const keyB = key(b) ?? -Infinity;
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  });
};
