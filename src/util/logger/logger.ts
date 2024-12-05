/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Logger } from "winston";
import config from "../../config";
import { LogLevel } from "../error/index";

let winstonLogger: Logger | undefined;

// NOTE: The winston setup does not run in a browser, so lets not import it there.
if (import.meta.env?.SSR) {
  import("./winston").then((w) => {
    winstonLogger = w.winstonLogger;
  });
}

class NDLALogger {
  /** Logging method which logs with console on client and with winston on server */
  log(level: LogLevel, message: any, ...meta: any[]) {
    if (!config.isClient && winstonLogger) {
      winstonLogger[level](message, ...meta);
    } else {
      // eslint-disable-next-line no-console
      console[level](message, ...meta);
    }

    return this;
  }

  info(message: any, ...meta: any[]) {
    return this.log("info", message, ...meta);
  }

  error(message: any, ...meta: any[]) {
    return this.log("error", message, ...meta);
  }

  warn(message: any, ...meta: any[]) {
    return this.log("warn", message, ...meta);
  }
}

const log = new NDLALogger();
export default log;
