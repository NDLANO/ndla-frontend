/**
 * Copyright (c) 2025-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import log from "../../util/logger";
import config from "../../config";
import { Server } from "http";
import { getActiveRequests } from "../middleware/activeRequestsMiddleware";
import { getIsShuttingDown, setIsShuttingDown } from "../routes/healthRouter";

async function waitForActiveRequests() {
  const timeout = 30000;
  const pollInterval = 250;
  const start = Date.now();

  const activeRequests = getActiveRequests();
  log.info(`Waiting for ${activeRequests} active requests to finish...`);
  while (getActiveRequests() > 0 && Date.now() - start < timeout) {
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
  }

  if (getActiveRequests() > 0) {
    log.warn(`Timeout reached while waiting for active requests to finish. Active requests: ${getActiveRequests()}`);
  } else {
    log.info("All active requests have finished processing.");
  }
}

export async function gracefulShutdown(server: Server) {
  if (getIsShuttingDown()) return;
  setIsShuttingDown();
  const gracePeriod = config.gracePeriodSeconds;
  log.info(`Recieved shutdown signal, waiting ${gracePeriod} seconds for shutdown to be detected before stopping...`);
  setTimeout(async () => {
    log.info("Shutting down gracefully...");
    await waitForActiveRequests();
    if (server) server.close();
    process.exit(0);
  }, gracePeriod * 1000);
}
