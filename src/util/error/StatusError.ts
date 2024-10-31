/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { LogLevel } from "./index";
import { NDLAError } from "./NDLAError";

export class StatusError extends NDLAError {
  status: number | undefined;
  json: unknown | undefined;
  logLevel: LogLevel = "error";
  constructor(message: string, status: number, json?: unknown) {
    super(message);
    this.status = status;
    this.json = json;
  }
}

export class BadRequestError extends StatusError {
  logLevel: LogLevel = "info";
  constructor(message: string) {
    super(message, 400);
  }
}
