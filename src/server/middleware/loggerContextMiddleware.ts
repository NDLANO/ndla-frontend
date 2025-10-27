/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { AsyncLocalStorage } from "node:async_hooks";
import { NextFunction, Request, Response } from "express";
import { uuid } from "@ndla/util";
import { LoggerContext } from "../../util/logger/loggerContext";

const asyncLocalStorage = new AsyncLocalStorage<LoggerContext>();

const getAsString = (value: any): string => {
  return typeof value === "string" ? value : "";
};

export const withCtx = <T>(ctx: LoggerContext, f: () => T): T => {
  return asyncLocalStorage.run(ctx, f);
};

export const loggerContextMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const fromReq = getAsString(req.headers["x-correlation-id"]);
  const correlationID = fromReq ? fromReq : uuid();

  const ctx: LoggerContext = {
    correlationID,
    requestPath: req.url,
  };

  asyncLocalStorage.run(ctx, () => {
    next();
  });
};

export function getLoggerContextStore(): LoggerContext | undefined {
  return asyncLocalStorage.getStore();
}
