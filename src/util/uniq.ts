/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const uniq = <T>(array: T[]): T[] => {
  return Array.from(new Set(array));
};

export const uniqBy = <T>(array: T[], key: (val: T) => string | number | symbol): T[] => {
  return [...new Map(array.map<[string | number | symbol, T]>((o) => [key(o), o]).reverse()).values()];
};
