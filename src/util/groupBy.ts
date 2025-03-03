/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const groupBy = <T>(
  array: T[] | undefined,
  key: (val: T) => string | number | symbol | undefined,
): Record<string, T[]> => {
  if (!array) return {};
  return array.reduce<Record<string | number | symbol, T[]>>((acc, curr) => {
    const group = key(curr)?.toString() ?? "undefined";
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(curr);
    return acc;
  }, {});
};
