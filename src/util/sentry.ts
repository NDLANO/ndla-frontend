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
  // Network problems
  "Failed to fetch",
  // https://github.com/getsentry/sentry/issues/61469
  'Object.prototype.hasOwnProperty.call(o,"telephone")',
  'Object.prototype.hasOwnProperty.call(e,"telephone")',
  // https://github.com/matomo-org/matomo/issues/22836
  "'get' on proxy: property 'javaEnabled' is a read-only and non-configurable data property",
  // Based on Sentry issues. ChromeOS specific errors.
  "Request timeout getDictionariesByLanguageId",
  "Request timeout getSupportScreenShot",
  "Request timeout isDictateAvailable",
  "Request timeout isPredictionAvailable",
  "Request timeout dictionariesDistributor.getValue",
  "Request timeout speechVoicesDistributor.getValue",
  "Request timeout userDistributor.getValue",
  "Request timeout predictionDistributor.getValue",
  "Request timeout dictateStateDistributor.getValue",
  "Request timeout nn-NO_wordsDistributor.getValue",
  "Request timeout availableTextCheckLanguagesDistributor.getValue",
  "Request timeout es_wordsDistributor.getValue",
  "Request timeout lettersVoicesDistributor.getValue",
  "Request timeout topicsDistributor.getValue",
  "Request timeout availableLanguagesDistributor.getValue",
  "Request timeout ac_wordsDistributor.getValue",
  "Request timeout nb-NO_wordsDistributor.getValue",
  "Request timeout ua_wordsDistributor.getValue",
  "Request timeout en_wordsDistributor.getValue",
  "Request timeout appSettingsDistributor.getValue",
  "Request timeout DefineExpirationForLanguagePacks.getValue",
  "Request timeout textCheckersDistributor.getValue",
  "Request timeout de_wordsDistributor.getValue",
  "Request timeout fr_wordsDistributor.getValue",
  "Request timeout ru_wordsDistributor.getValue",
];

export const beforeSend = (event: Sentry.ErrorEvent, hint: Sentry.EventHint) => {
  const exception = hint.originalException;
  const infoError = isInformationalError(exception);
  if (infoError) return null;

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
