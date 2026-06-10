/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "source-map-support/register";
import { isSpanContextValid, trace } from "@opentelemetry/api";
import pc from "picocolors";
import type { Formatter } from "picocolors/types";
import winston from "winston";
import config from "../../config";

const logLevelColors: Record<string, Formatter> = {
  error: pc.red,
  warn: pc.yellow,
  info: pc.blue,
};

const indentString = (str: string): string => {
  return str
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
};

const traceContextFormat = winston.format((info) => {
  const ctx = trace.getActiveSpan()?.spanContext();
  if (ctx && isSpanContextValid(ctx)) {
    info.trace_id = ctx.traceId;
    info.span_id = ctx.spanId;
    info.trace_flags = ctx.traceFlags.toString(16).padStart(2, "0");
  }
  return info;
});

const getFormat = () => {
  if (config.runtimeType === "production") {
    return winston.format.combine(
      traceContextFormat(),
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
    const extras = info[Symbol.for("splat")];
    let metaObj = rest;
    extras?.forEach((e: any, index: number) => {
      if (typeof e === "object" && Array.isArray(e)) {
        metaObj[`array[${index}]`] = e;
      } else if (typeof e === "object") {
        metaObj = { ...metaObj, ...e };
      } else if (typeof e === "string") {
        metaObj[`string[${index}`] = e;
      } else {
        metaObj[`[${index}]`] = e;
      }
    });
    const meta = indentString(JSON.stringify(metaObj, null, 2));

    if (stack) logLine += `\n${indentString(stack)}`;
    if (Object.keys(rest).length > 0) logLine += `\n${meta}`;

    return logLine;
  });

  return winston.format.combine(winston.format.timestamp(), plainFormat);
};

export const winstonLogger = winston.createLogger({
  defaultMeta: { service: "ndla-frontend" },
  format: getFormat(),
  transports: [new winston.transports.Console()],
});
