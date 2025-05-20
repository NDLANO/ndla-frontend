/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError } from "@apollo/client";
import * as Sentry from "@sentry/react";
import { ErrorType, UnknownError } from "./error";
import { NDLAError } from "./error/NDLAError";
import { StatusError } from "./error/StatusError";
import log from "./logger";
import config from "../config";
import { unreachable } from "./guards";
import { LogLevel } from "../interfaces";

type SingleGQLError = {
  status?: number;
  extensions?: { status?: number };
  path?: string;
};

type UnknownGQLError = {
  status?: number;
  graphQLErrors?: SingleGQLError[] | null;
};

export const getErrorStatuses = (unknownError: UnknownError | null | undefined): number[] => {
  const statuses: number[] = [];
  // We cast to our own error type since we append status in graphql-api
  const error = unknownError as UnknownGQLError | null | undefined;

  if (error !== null && error !== undefined) {
    if (error?.status) {
      statuses.push(error.status);
    } else if (error.graphQLErrors) {
      error.graphQLErrors.forEach((e) => {
        if (e.status) {
          statuses.push(e.status);
          return;
        }
        if (e?.extensions?.status) {
          statuses.push(e?.extensions.status);
          return;
        }
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

export const findAccessDeniedErrors = (unknownError: ErrorType | undefined | null): SingleGQLError[] => {
  // We cast to our own error type since we append status in graphql-api
  const error = unknownError as UnknownGQLError | null | undefined;
  const accessDeniedErrors = error?.graphQLErrors?.filter((gqle) => {
    const code = gqle.status ?? gqle.extensions?.status;
    return AccessDeniedCodes.includes(code ?? 0);
  });
  return accessDeniedErrors ?? [];
};

export const isNotFoundError = (error: ErrorType | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => c === 404) !== undefined;
};

const getMessage = (error: UnknownError): string => {
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

const getErrorLog = (
  error: UnknownError,
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

export const deriveLogLevel = (error: UnknownError): LogLevel | undefined => {
  if (error instanceof NDLAError) return error.logLevel;

  const statusCodes = getErrorStatuses(error);
  const logLevels = statusCodes.map((sc) => getLogLevelFromStatusCode(sc));
  return mergeLogLevels(logLevels);
};

const deriveContext = (error: ErrorType): Record<string, unknown> => {
  if (error instanceof NDLAError) {
    return error.logContext;
  }
  return {};
};

const logServerError = async (
  error: ErrorType,
  requestPathOverride: string | undefined,
  extraContext: Record<string, unknown>,
): Promise<void> => {
  if (import.meta.env.SSR) {
    const { getContext } = await import("../server/helpers/ndlaContextStore");
    const derivedContext = deriveContext(error);
    const serverContext = getContext();
    const requestPath = requestPathOverride ?? serverContext?.requestPath;
    const ctx = { ...extraContext, requestPath, ...serverContext, ...derivedContext };
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
  }
};

const sendToSentry = (error: ErrorType, requestPath: string | undefined, extraContext: Record<string, unknown>) => {
  const errorContext = { error, requestPath, ...extraContext };
  Sentry.setContext("NDLA Context", errorContext);
  Sentry.captureException(error);
};

export const ensureError = (unknownError: UnknownError): ErrorType => {
  if (unknownError instanceof Error) return unknownError;
  return new NDLAError(String(unknownError));
};

const handleError = async (error: ErrorType, requestPath?: string, extraContext: Record<string, unknown> = {}) => {
  if (config.runtimeType === "production" && config.isClient) {
    sendToSentry(error, requestPath, extraContext);
  } else if (!config.isClient) {
    await logServerError(error, requestPath, extraContext);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
export default handleError;
