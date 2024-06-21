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

const { combine, timestamp, printf } = format;

const errFormat = printf(({ level, message, stack, requestPath, timestamp }) => {
  const stackString = stack ? `\n${stack}` : "";
  const requestPathStr = requestPath ? `${requestPath} ` : "";
  return `[ndla-frontend] ${timestamp} [${level}] ${requestPathStr}${message}${stackString}`;
});

const log = createLogger({
  defaultMeta: { service: "ndla-frontend" },
  format: combine(timestamp(), errFormat),
  transports: [new transports.Console()],
});

export default log;
