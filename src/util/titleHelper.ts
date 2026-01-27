/**
 * Copyright (c) 2021-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const htmlTitle = (main: string | undefined, elements: Array<string | undefined>): string =>
  elements?.reduce<string>((acc, curr) => {
    if (curr) {
      acc += ` - ${curr}`;
    }
    return acc;
  }, main ?? "");
