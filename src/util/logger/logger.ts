/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { Logger } from "winston";
import config from "../../config";
import { LogLevel } from "../../interfaces";
import { getLoggerContext } from "./getLoggerContext";
import { getErrorLog } from "../handleError";
import { LoggerContext } from "./loggerContext";

let winstonLogger: Logger | undefined;

// NOTE: The winston setup does not run in a browser, so lets not import it there.
if (typeof __IS_SSR_BUILD__ === "undefined" || __IS_SSR_BUILD__) {
  import("./winston").then((w) => {
    winstonLogger = w.winstonLogger;
  });
}

export type Loggable = string | object | Error | unknown;

class NDLALogger {
  async getMeta(metaInput: Loggable[]) {
    const metaObjects = await Promise.all(
      metaInput.map((m) => {
        return this.getMessage(m, [], undefined);
      }),
    );

    if (metaObjects.length === 0) return undefined;
    if (metaObjects.length === 1) return metaObjects[0];
    return metaObjects.reduce((acc, curr) => {
      return { ...acc, ...curr };
    });
  }

  errorToObject(message: Error): object {
    const errorLog = getErrorLog(message, {});
    if (typeof errorLog === "string") {
      return { message: errorLog };
    }

    return { ...errorLog };
  }

  findErrorInMeta(metaInput: Loggable[]): { error: Error | undefined; newMetaInput: Loggable[] } {
    for (const [i, item] of metaInput.entries()) {
      if (item instanceof Error) {
        return { error: item, newMetaInput: metaInput.toSpliced(i, 1) };
      } else if (typeof item === "object" && item !== null) {
        const error = Object.values(item).find((value) => value instanceof Error);
        if (error instanceof Error) {
          return { error, newMetaInput: metaInput.toSpliced(i, 1) };
        }
      }
    }
    return { error: undefined, newMetaInput: metaInput };
  }

  async getMessage(message: Loggable, metaInput: Loggable[], ctx: LoggerContext | undefined): Promise<object> {
    if (message instanceof Error) {
      const errorMessage = this.errorToObject(message);
      const logMeta = await this.getMeta(metaInput);
      return { ...ctx, logMeta, ...errorMessage };
    }

    const maybeError = this.findErrorInMeta(metaInput);
    const logMeta = await this.getMeta(maybeError?.newMetaInput);
    const errorMsg = maybeError.error ? this.errorToObject(maybeError.error) : undefined;

    if (typeof message === "object") return { ...ctx, logMeta, ...errorMsg, ...message };
    return { ...ctx, logMeta, ...errorMsg, message };
  }

  /** Logging method which logs with console on client and with winston on server */
  async log(level: LogLevel, message: Loggable, ...meta: Loggable[]): Promise<void> {
    const ctx = await getLoggerContext();
    const msg = await this.getMessage(message, meta, ctx);
    if (!config.isClient && winstonLogger) {
      winstonLogger[level](msg);
    } else {
      // eslint-disable-next-line no-console
      console[level](msg, ...meta);
    }
  }

  info(message: Loggable, ...meta: Loggable[]): void {
    this.log("info", message, ...meta);
  }

  error(message: Loggable, ...meta: Loggable[]): void {
    this.log("error", message, ...meta);
  }

  warn(message: Loggable, ...meta: Loggable[]): void {
    this.log("warn", message, ...meta);
  }
}

const log = new NDLALogger();
export default log;
