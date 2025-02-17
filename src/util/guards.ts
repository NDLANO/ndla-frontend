/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export const unreachable = (parameter: never): never => {
  throw new Error(`This code should be unreachable but is not, because '${parameter}' is not of 'never' type.`);
};
