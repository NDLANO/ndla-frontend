/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "source-map-support/register";
import pc from "picocolors";
import type { Formatter } from "picocolors/types";
import { LogLevel } from "./error";
import config from "../config";

let winstonLogger: any | undefined;

const logLevelColors: Record<string, Formatter> = {
  error: pc.red,
  warn: pc.yellow,
  info: pc.blue,
};

// NOTE: This winston setup does not run in a browser, so lets not import it there.
if ((config.runtimeType === "production" && import.meta.env.SSR) || !config.isClient) {
  import("winston").then((winston) => {
    const indentString = (str: string): string => {
      return str
        .split("\n")
        .map((line) => `  ${line}`)
        .join("\n");
    };

    const getFormat = () => {
      if (config.runtimeType === "production") {
        return winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        );
      }

      const plainFormat = winston.format.printf((info) => {
        const { level, message, timestamp, stack, service: _service, ...rest } = info;
        const colorFunc = logLevelColors[level] ?? pc.white;
        const coloredLevel = colorFunc(pc.bold(level.toUpperCase()));
        let logLine = `[${coloredLevel}] ${timestamp}: ${message}`;
        if (stack) logLine += `\n${indentString(stack)}`;
        if (Object.keys(rest).length > 0) logLine += `\n${indentString(JSON.stringify(rest, null, 2))}`;

        return logLine;
      });

      return winston.format.combine(winston.format.timestamp(), plainFormat);
    };

    winstonLogger = winston.createLogger({
      defaultMeta: { service: "ndla-frontend" },
      format: getFormat(),
      transports: [new winston.transports.Console()],
    });
  });
}

class NDLALogger {
  /** Logging method which logs with console on client and with winston on server */
  log(level: LogLevel, message: any, ...meta: any[]) {
    if (!config.isClient) {
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
