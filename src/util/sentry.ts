/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as Sentry from "@sentry/react";
import { deriveLogLevel } from "./handleError";
import { ConfigType } from "../config";

const isInformationalError = (exception: unknown): boolean => {
  const logLevel = deriveLogLevel(exception);
  return logLevel === "info";
};

const sentryIgnoreErrors = [
  'Object.prototype.hasOwnProperty.call(o,"telephone")',
  'Object.prototype.hasOwnProperty.call(e,"telephone")',
  "'get' on proxy: property 'javaEnabled' is a read-only and non-configurable data property",
];

export const beforeSend = (event: Sentry.ErrorEvent, hint: Sentry.EventHint) => {
  const exception = hint.originalException;
  const infoError = isInformationalError(exception);
  if (infoError) return null;

  if (
    exception instanceof Error &&
    (exception.message === "Failed to fetch" || exception.message === "[Network error]: Failed to fetch")
  ) {
    // Don't send network errors without more information
    // These are not really something we can fix, usually triggered by exceptions blocking requests
    // so logging them shouldn't provide much value.
    return null;
  }

  if (exception instanceof Error && sentryIgnoreErrors.find((e) => exception.message.includes(e)) !== undefined) {
    // https://github.com/getsentry/sentry/issues/61469
    // https://github.com/matomo-org/matomo/issues/22836
    return null;
  }

  return event;
};

export const initSentry = (config: ConfigType) => {
  if (config.ndlaEnvironment === "local" || config.ndlaEnvironment === "dev") {
    // Skipping sentry initialization in local and dev environments
    return;
  }

  Sentry.init({
    dsn: config.sentrydsn,
    environment: config.ndlaEnvironment,
    beforeSend,
    integrations: [],
  });
};
