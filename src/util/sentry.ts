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

  if (
    exception instanceof Error &&
    sentryIgnoreErrors.find(
      (e) => (e.exact ? exception.message === e.error : exception.message.includes(e.error)) !== undefined,
    )
  ) {
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
