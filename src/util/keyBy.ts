/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const keyBy = <T>(
  array: T[] | undefined,
  key: (val: T) => string | number | symbol,
): Record<string | number | symbol, T> => {
  if (!array) return {};
  return array.reduce<Record<string | number | symbol, T>>((acc, curr) => {
    acc[key(curr)] = curr;
    return acc;
  }, {});
};
