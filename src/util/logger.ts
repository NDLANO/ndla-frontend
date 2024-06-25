/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// N.B! don't import this on the client!

import { createLogger, transports, format } from "winston";
import "source-map-support/register";

const log = createLogger({
  defaultMeta: { service: "ndla-frontend" },
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.json()),
  transports: [new transports.Console()],
});

export default log;
