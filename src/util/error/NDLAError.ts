/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LogLevel } from "../../interfaces";

export class NDLAError extends Error {
  logLevel: LogLevel = "error";
  logContext: Record<string, unknown> = {};
}
