/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError } from "@apollo/client";

export type ErrorType = ApolloError | Error | StatusError | BadRequestError | string | unknown;
export type LogLevel = "error" | "warn" | "info";

export class StatusError extends Error {
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
