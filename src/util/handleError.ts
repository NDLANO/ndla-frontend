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
  const logger = await import("./logger");
  log = logger.default;
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

export const isAccessDeniedError = (error: ApolloError | undefined | null): boolean => {
  if (!error) return false;
  const codes = getErrorStatuses(error);
  return codes.find((c) => AccessDeniedCodes.includes(c)) !== undefined;
};

const handleError = (error: ApolloError | Error | string | unknown, info?: ErrorInfo | { clientTime: Date }) => {
  if (config.runtimeType === "production" && config.isClient) {
    ErrorReporter.getInstance().captureError(error, info);
  } else if (config.runtimeType === "production" && !config.isClient) {
    log?.error(error);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
export default handleError;
