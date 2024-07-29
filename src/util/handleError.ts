/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ErrorInfo } from "react";
import { ApolloError } from "@apollo/client";
import { ErrorReporter } from "@ndla/error-reporter";
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

export const getErrorStatuses = (unknownError: ApolloError | null | undefined): number[] => {
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

export const isAccessDeniedError = (error: ApolloError | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => AccessDeniedCodes.includes(c)) !== undefined;
};

export const isNotFoundError = (error: ApolloError | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => c === 404) !== undefined;
};

export const isInternalServerError = (error: ApolloError | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => InternalServerErrorCodes.includes(c)) !== undefined;
};

const getErrorLog = (
  error: ApolloError | Error | string | unknown,
  extraContext: Record<string, unknown>,
): ApolloError | Error | string | unknown => {
  if (typeof error === "object") {
    const errWithPath = error as { requestPath?: string } & object;
    return { ...errWithPath, ...extraContext };
  }

  if (typeof error === "string") {
    return { message: error, ...extraContext };
  }

  return error;
};

export type LogLevel = "error" | "warn" | "info";
const unreachable = (parameter: never): never => {
  throw new Error(`This code should be unreachable but is not, because '${parameter}' is not of 'never' type.`);
};

const logServerError = async (
  error: ApolloError | Error | string | unknown,
  requestPath: string | undefined,
  loglevel: LogLevel | undefined,
  extraContext: Record<string, unknown>,
) => {
  const ctx = { ...extraContext, requestPath };
  const err = getErrorLog(error, ctx);
  switch (loglevel) {
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
      unreachable(loglevel);
  }
};

const handleError = async (
  error: ApolloError | Error | string | unknown,
  info?: ErrorInfo | { clientTime: Date },
  requestPath?: string,
  loglevel?: LogLevel,
  extraContext: Record<string, unknown> = {},
) => {
  if (config.runtimeType === "production" && config.isClient) {
    ErrorReporter.getInstance().captureError(error, info);
  } else if (config.runtimeType === "production" && !config.isClient) {
    await logServerError(error, requestPath, loglevel, extraContext);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
export default handleError;
