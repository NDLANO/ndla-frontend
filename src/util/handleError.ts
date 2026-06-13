/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { CombinedGraphQLErrors, ErrorLike } from "@apollo/client";
import { captureException, setContext } from "@sentry/react";
import { GraphQLFormattedError } from "graphql";
import { isRouteErrorResponse } from "react-router";
import config from "../config";
import { LogLevel } from "../interfaces";
import { GONE, NOT_FOUND } from "../statusCodes";
import { NDLAError } from "./error/NDLAError";
import { StatusError } from "./error/StatusError";
import { unreachable } from "./guards";
import { getLoggerContext } from "./logger/getLoggerContext";
import { log } from "./logger/logger";
import { LoggerContext } from "./logger/loggerContext";

type UnknownError = {
  status?: number;
};

const getErrorStatuses = (error: unknown): number[] => {
  const statuses: number[] = [];
  if (error == null) return statuses;
  const unknownError = error as UnknownError;
  if (unknownError.status) {
    statuses.push(unknownError.status);
  } else if (CombinedGraphQLErrors.is(error)) {
    if (typeof error.extensions?.status === "number") {
      statuses.push(error.extensions.status);
    }
    error.errors.forEach((e) => {
      const unknownError = e as UnknownError;
      if (unknownError.status) {
        statuses.push(unknownError.status);
        return;
      }
      if (typeof e.extensions?.status === "number") {
        statuses.push(e.extensions.status);
      }
    });
  }
  return statuses;
};

export const AccessDeniedCodes = [401, 403];

export const InternalServerErrorCodes = [500, 503, 504];

const isErrorOfType = (error: ErrorLike | undefined | null, errorCodes: number[]): error is CombinedGraphQLErrors => {
  if (!error) return false;
  else if (CombinedGraphQLErrors.is(error)) {
    return error.errors.some(
      // I don't know if `e.status` can actually happen, but we used to check it
      (e) => errorCodes.includes((e as any).status as number) || errorCodes.includes(e.extensions?.status as number),
    );
  } else return false;
};

export const isAccessDeniedError = (error: ErrorLike | undefined | null) => isErrorOfType(error, AccessDeniedCodes);

export const findAccessDeniedErrors = (error: ErrorLike | undefined | null): GraphQLFormattedError[] => {
  if (CombinedGraphQLErrors.is(error)) {
    return error.errors.filter((err) => {
      // not sure if `err.status` ever exists
      const code = (err as any).status ?? err.extensions?.status;
      return AccessDeniedCodes.includes(code ?? 0);
    });
  }
  return [];
};

export const isNotFoundError = (error: ErrorLike | undefined | null) => isErrorOfType(error, [NOT_FOUND]);

export const isGoneError = (error: ErrorLike | undefined | null) => isErrorOfType(error, [GONE]);

const getMessage = (error: Error | unknown): string => {
  if (error instanceof StatusError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (error instanceof AggregateError) {
    const aggregateMessages = error.errors.map((e) => {
      const message = getMessage(e);
      const stack = e.stack ? `Stack: ${e.stack}` : "";
      return `${message} ${stack}`;
    });
    return `AggregateError with errors: [${aggregateMessages}]`;
  }
  if (typeof error === "string" && error) return error;

  // React Router surfaces routing failures (e.g. "No route matches URL") as ErrorResponse
  // objects where the human-readable text lives in `data`, not `message`.
  if (isRouteErrorResponse(error)) {
    const { data } = error;
    if (typeof data === "string" && data) return data;
    if (data instanceof Error && data.message) return data.message;
    if (data && typeof data === "object" && typeof (data as { message?: unknown }).message === "string") {
      return (data as { message: string }).message;
    }
    return error.statusText || `${error.status}`;
  }

  // Fall back to whatever text a non-Error object carries before giving up, so a log is never opaque.
  if (error && typeof error === "object") {
    const obj = error as Record<string, unknown>;
    if (typeof obj.message === "string" && obj.message) return obj.message;
    const nested = obj.error;
    if (nested && typeof nested === "object" && typeof (nested as { message?: unknown }).message === "string") {
      return (nested as { message: string }).message;
    }
    if (typeof obj.data === "string" && obj.data) return obj.data;
    if (typeof obj.statusText === "string" && obj.statusText) return obj.statusText;
    try {
      const snapshot = JSON.stringify(error);
      if (snapshot && snapshot !== "{}") return snapshot.slice(0, 1000);
    } catch {
      // Circular reference — fall through to the generic message.
    }
  }

  return "Got error without message";
};

const getStatus = (extraContext: object | undefined, error: Error | unknown): number | undefined => {
  if (extraContext && "statusCode" in extraContext && typeof extraContext.statusCode === "number")
    return extraContext.statusCode;
  if (isRouteErrorResponse(error)) return error.status;
  if (error instanceof StatusError) return error.status;
  if (error instanceof Error && "status" in error && typeof error.status === "number") {
    return error.status;
  }
  return undefined;
};

export const getErrorLog = (error: ErrorLike | unknown, extraContext: object | undefined): object | string => {
  const ctx = { ...extraContext, statusCode: getStatus(extraContext, error) };
  if (!error) return { ...ctx, message: `Unknown error: ${JSON.stringify(error)}` };

  if (error instanceof StatusError) {
    return {
      ...ctx,
      message: getMessage(error),
      json: error.json,
      status: error.status,
      stack: error.stack,
      name: error.name,
    };
  }

  if (error instanceof Error) {
    return {
      ...ctx,
      message: getMessage(error),
      stack: error.stack,
      name: error.name,
    };
  }

  if (isRouteErrorResponse(error)) {
    return {
      ...ctx,
      message: getMessage(error),
      status: error.status,
      statusText: error.statusText,
      data: typeof error.data === "string" ? error.data : serializeCause(error.data),
    };
  }

  if (typeof error === "object") {
    return { ...error, ...ctx, message: getMessage(error) };
  }

  if (typeof error === "string") {
    return { ...ctx, message: getMessage(error) };
  }

  return error;
};

export const getLogLevelFromStatusCode = (statusCode: number): LogLevel => {
  if ([401, 403, 404, 410].includes(statusCode)) return "info";
  if (statusCode < 500) return "warn";
  return "error";
};

export const mergeLogLevels = (levels: LogLevel[]): LogLevel | undefined => {
  if (levels.length === 0) return undefined;
  if (levels.every((l) => l === "info")) return "info";
  if (levels.every((l) => l === "warn" || "info")) return "warn";
  if (levels.includes("error")) return "error";
  return undefined;
};

export const deriveLogLevel = (error: Error | unknown): LogLevel | undefined => {
  if (error instanceof NDLAError) return error.logLevel;

  const statusCodes = getErrorStatuses(error);
  const logLevels = statusCodes.map((sc) => getLogLevelFromStatusCode(sc));
  return mergeLogLevels(logLevels);
};

const deriveContext = (error: Error): Record<string, unknown> => {
  if (error instanceof NDLAError) {
    return error.logContext;
  }
  return {};
};

const logServerError = async (error: Error, extraContext: Record<string, unknown>) => {
  const derivedContext = deriveContext(error);
  const ctx = { ...extraContext, ...derivedContext };
  const logLevel = deriveLogLevel(error);
  const err = getErrorLog(error, ctx);
  switch (logLevel) {
    case "info":
      log.info(err);
      break;
    case "warn":
      log.warn(err);
      break;
    case "error":
    case undefined:
      log.error(err);
      break;
    default:
      unreachable(logLevel);
  }
};

const sendToSentry = (
  error: Error,
  loggerContext: LoggerContext | undefined,
  extraContext: Record<string, unknown>,
) => {
  const errorContext = { error, ...loggerContext, ...extraContext };
  setContext("NDLA Context", errorContext);
  captureException(error);
};

export const ensureError = (unknownError: ErrorLike | unknown): ErrorLike => {
  if (unknownError instanceof Error) return unknownError;
  return new NDLAError(String(unknownError));
};

export const handleError = async (error: ErrorLike, extraContext: Record<string, unknown> = {}) => {
  if (config.runtimeType === "production" && config.isClient) {
    const ctx = await getLoggerContext();
    sendToSentry(error, ctx, extraContext);
  } else if (!config.isClient) {
    await logServerError(error, extraContext);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
