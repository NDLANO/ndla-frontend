/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Router, Request, Response } from "express";

let isShuttingDown = false;

export function getIsShuttingDown(): boolean {
  return isShuttingDown;
}

export function setIsShuttingDown() {
  isShuttingDown = true;
}

export const healthRouter = Router();
const livenessHandler = (_: Request, res: Response) => {
  res.status(200).json({ status: 200, text: "Health check ok" });
};

healthRouter.get("/health", livenessHandler);
healthRouter.get("/health/liveness", livenessHandler);
healthRouter.get("/health/readiness", (_: Request, res: Response) => {
  if (!isShuttingDown) {
    res.status(200).json({ status: 200, text: "Health check ok" });
  } else {
    res.status(500).json({ status: 500, text: "Service shutting down" });
  }
});
