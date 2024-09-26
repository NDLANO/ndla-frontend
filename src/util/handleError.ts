/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { ErrorType, LogLevel, StatusError } from "./error";
import config from "../config";

let log: any | undefined;

// import.meta.env is only available when ran within vite. `handleError` can be called from the root server.
// This does not apply when running a production build, as we inject import.meta.env.SSR through esbuild.
// All in all, this ensures that winston is only imported on the server during production builds.
if (config.runtimeType === "production" && import.meta.env.SSR) {
  import("./logger").then((l) => {
    log = l.default;
  });
}

type UnknownGQLError = {
  status?: number;
  graphQLErrors?: { status?: number }[] | null;
};

export const getErrorStatuses = (unknownError: ErrorType | null | undefined): number[] => {
  const statuses: number[] = [];
  // We cast to our own error type since we append status in graphql-api
  const error = unknownError as UnknownGQLError | null | undefined;

  if (error !== null && error !== undefined) {
    if (error?.status) {
      statuses.push(error.status);
    } else if (error.graphQLErrors) {
      error.graphQLErrors.forEach((e) => {
        if (e.status) statuses.push(e.status);
      });
    }
  }

  return statuses;
};

export const AccessDeniedCodes = [401, 403];

export const InternalServerErrorCodes = [500, 503, 504];

export const isAccessDeniedError = (error: ErrorType | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => AccessDeniedCodes.includes(c)) !== undefined;
};

export const isNotFoundError = (error: ErrorType | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => c === 404) !== undefined;
};

export const isInternalServerError = (error: ErrorType | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => InternalServerErrorCodes.includes(c)) !== undefined;
};

const getMessage = (error: ErrorType): string => {
  if (error instanceof StatusError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return "Got error without message";
};

const getErrorLog = (
  error: ErrorType,
  extraContext: Record<string, unknown>,
): ApolloError | Error | string | unknown => {
  if (!error) return { ...extraContext, message: `Unknown error: ${JSON.stringify(error)}` };

  if (error instanceof StatusError) {
    return {
      ...extraContext,
      message: getMessage(error),
      json: error.json,
      status: error.status,
      stack: error.stack,
      name: error.name,
    };
  }

  if (error instanceof Error) {
    return {
      ...extraContext,
      message: getMessage(error),
      stack: error.stack,
      name: error.name,
    };
  }

  if (typeof error === "object") {
    return { ...error, ...extraContext, message: getMessage(error) };
  }

  if (typeof error === "string") {
    return { ...extraContext, message: getMessage(error) };
  }

  return error;
};

const unreachable = (parameter: never): never => {
  throw new Error(`This code should be unreachable but is not, because '${parameter}' is not of 'never' type.`);
};

const getLogLevelFromStatusCode = (statusCode: number): LogLevel => {
  if ([401, 403, 404, 410].includes(statusCode)) return "info";
  if (statusCode < 500) return "warn";
  return "error";
};

const deriveLogLevel = (error: ErrorType): LogLevel | undefined => {
  if (error instanceof StatusError) return error.logLevel;

  const statusCodes = getErrorStatuses(error);
  const logLevels = statusCodes.map((sc) => getLogLevelFromStatusCode(sc));

  if (logLevels.length === 0) return undefined;

  if (logLevels.every((l) => l === "info")) return "info";
  if (logLevels.every((l) => l === "warn" || "info")) return "warn";
  if (logLevels.includes("error")) return "error";
  return undefined;
};

const logServerError = async (
  error: ErrorType,
  requestPath: string | undefined,
  extraContext: Record<string, unknown>,
) => {
  const ctx = { ...extraContext, requestPath };
  const logLevel = deriveLogLevel(error);
  const err = getErrorLog(error, ctx);
  switch (logLevel) {
    case "info":
      await log?.info(err);
      break;
    case "warn":
      await log?.warn(err);
      break;
    case "error":
    case undefined:
      await log?.error(err);
      break;
    default:
      unreachable(logLevel);
  }
};

const handleError = async (error: ErrorType, requestPath?: string, extraContext: Record<string, unknown> = {}) => {
  if (config.runtimeType === "production" && config.isClient) {
    Sentry.captureException(error);
  } else if (config.runtimeType === "production" && !config.isClient) {
    await logServerError(error, requestPath, extraContext);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
export default handleError;
