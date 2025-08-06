/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NextFunction, Request, Response } from "express";

let activeRequests = 0;

export const activeRequestsMiddleware = (_: Request, res: Response, next: NextFunction): void => {
  activeRequests++;
  res.on("finish", () => {
    activeRequests--;
  });
  next();
};

export const getActiveRequests = (): number => {
  return activeRequests;
};
