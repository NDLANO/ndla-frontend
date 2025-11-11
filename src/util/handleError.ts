/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { NDLAError } from "./error/NDLAError";
import { StatusError } from "./error/StatusError";
import { log } from "./logger/logger";
import { unreachable } from "./guards";
import { LogLevel } from "../interfaces";
import { LoggerContext } from "./logger/loggerContext";
import { getLoggerContext } from "./logger/getLoggerContext";
import { CombinedGraphQLErrors, ErrorLike } from "@apollo/client";
import { GONE, NOT_FOUND } from "../statusCodes";
import { GraphQLFormattedError } from "graphql";
import { captureException, setContext } from "@sentry/react";
import { IS_CLIENT, IS_PRODUCTION } from "../buildConfig";

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
  return "Got error without message";
};

const getStatus = (extraContext: object | undefined, error: Error | unknown): number | undefined => {
  if (extraContext && "statusCode" in extraContext && typeof extraContext.statusCode === "number")
    return extraContext.statusCode;
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
  if (IS_PRODUCTION && IS_CLIENT) {
    const ctx = await getLoggerContext();
    sendToSentry(error, ctx, extraContext);
  } else if (!IS_CLIENT) {
    await logServerError(error, extraContext);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
