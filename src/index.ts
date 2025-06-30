/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import config from "./config";
import { gracefulShutdown } from "./server/helpers/gracefulShutdown";
import app from "./server/server";
import log from "./util/logger";

if (!config.isVercel) {
  const server = app.listen(config.port, () => {
    log.info(`> Started on port ${config.port}`);
  });
  process.on("SIGTERM", () => gracefulShutdown(server));
}

export default app;
