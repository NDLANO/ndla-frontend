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

type SentryIgnore = {
  error: string;
  exact?: boolean;
};

const sentryIgnoreErrors: SentryIgnore[] = [
  // Network problems
  { error: "[Network error]: Failed to fetch", exact: true },
  { error: "Failed to fetch", exact: true },
  // https://github.com/getsentry/sentry/issues/61469
  { error: 'Object.prototype.hasOwnProperty.call(o,"telephone")' },
  { error: 'Object.prototype.hasOwnProperty.call(e,"telephone")' },
  // https://github.com/matomo-org/matomo/issues/22836
  { error: "'get' on proxy: property 'javaEnabled' is a read-only and non-configurable data property" },
  // Based on Sentry issues. ChromeOS specific errors.
  { error: "Request timeout isMathOcrAvailable" },
  { error: "Request timeout getDictionariesByLanguageId" },
  { error: "Request timeout getSupportScreenShot" },
  { error: "Request timeout isDictateAvailable" },
  { error: "Request timeout isPredictionAvailable" },
  { error: "Request timeout dictionariesDistributor.getValue" },
  { error: "Request timeout speechVoicesDistributor.getValue" },
  { error: "Request timeout userDistributor.getValue" },
  { error: "Request timeout predictionDistributor.getValue" },
  { error: "Request timeout dictateStateDistributor.getValue" },
  { error: "Request timeout nn-NO_wordsDistributor.getValue" },
  { error: "Request timeout availableTextCheckLanguagesDistributor.getValue" },
  { error: "Request timeout es_wordsDistributor.getValue" },
  { error: "Request timeout lettersVoicesDistributor.getValue" },
  { error: "Request timeout topicsDistributor.getValue" },
  { error: "Request timeout availableLanguagesDistributor.getValue" },
  { error: "Request timeout ac_wordsDistributor.getValue" },
  { error: "Request timeout nb-NO_wordsDistributor.getValue" },
  { error: "Request timeout ua_wordsDistributor.getValue" },
  { error: "Request timeout en_wordsDistributor.getValue" },
  { error: "Request timeout appSettingsDistributor.getValue" },
  { error: "Request timeout DefineExpirationForLanguagePacks.getValue" },
  { error: "Request timeout textCheckersDistributor.getValue" },
  { error: "Request timeout de_wordsDistributor.getValue" },
  { error: "Request timeout fr_wordsDistributor.getValue" },
  { error: "Request timeout ru_wordsDistributor.getValue" },
];

export const beforeSend = (event: Sentry.ErrorEvent, hint: Sentry.EventHint) => {
  const exception = hint.originalException;
  const infoError = isInformationalError(exception);
  if (infoError) return null;

  const message =
    event.message || event?.exception?.values?.[0]?.value || (hint?.originalException as Error | undefined)?.message;
  if (typeof message !== "string") return event;

  // Extension error filtering
  const frames = event?.exception?.values?.[0]?.stacktrace?.frames || [];
  const hasExtensionFrame = frames.some((frame) => {
    const filename = frame?.filename || "";
    return (
      filename.startsWith("chrome-extension://") ||
      filename.startsWith("moz-extension://") ||
      filename.includes("extensions::")
    );
  });

  const isExtensionError =
    hasExtensionFrame || message.includes("chrome-extension://") || message.includes("moz-extension://");

  if (isExtensionError) return null;

  const ignoreEntry = sentryIgnoreErrors.find((ignoreEntry) => {
    if (ignoreEntry.exact) {
      return message === ignoreEntry.error;
    }
    return message.includes(ignoreEntry.error);
  });

  if (ignoreEntry) {
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

  const release = `${config.componentName}@${config.componentVersion}`;

  Sentry.init({
    dsn: config.sentrydsn,
    environment: config.ndlaEnvironment,
    normalizeDepth: 20,
    release,
    beforeSend,
    integrations: [],
  });
};
